"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaImage, FaSpinner, FaTimes } from "react-icons/fa";

// ACCESS THE KEY FROM ENVIRONMENT VARIABLES
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function CreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. Upload to ImgBB
  const uploadToImgBB = async (file: File): Promise<string | null> => {
    if (!IMGBB_API_KEY) {
      alert("Missing ImgBB API Key in .env file");
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        console.error("ImgBB Upload Error:", data);
        return null;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;
    setLoading(true);

    try {
      let finalImageUrl = "";
      if (imageFile) {
        const uploadedUrl = await uploadToImgBB(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          alert("Failed to upload image.");
          setLoading(false);
          return;
        }
      }

      // B. Save Post to Firebase
      if (user) {
        await addDoc(collection(db, "posts"), {
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhoto: user.photoURL || null,
          content: content,
          imageURL: finalImageUrl,
          visibility: visibility,
          likes: [],
          commentsCount: 0,
          createdAt: serverTimestamp(),
        });
      }

      setContent("");
      removeImage();
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex gap-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
          <Image
            src={user?.photoURL || "/assets/images/profile.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind?`}
            className="w-full bg-gray-100 text-gray-900 rounded-lg p-3 text-sm focus:outline-none resize-none h-20 placeholder-gray-500"
          ></textarea>
        </div>
      </div>

      {/* PREVIEW SECTION */}
      {previewUrl && (
        <div className="relative mb-4 ml-14">
          <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white text-gray-600 p-1.5 rounded-full shadow-md hover:bg-gray-200 transition z-10"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-3 border-gray-100">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600 transition bg-gray-50 px-3 py-2 rounded-md hover:bg-blue-50">
            <FaImage className="text-lg text-green-600" />
            <span className="text-sm font-medium">Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs rounded-md px-2 py-1.5 outline-none text-gray-700 cursor-pointer"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading || (!content && !imageFile)}
            className="bg-blue-600 text-white px-6 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
