"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useRef, useState } from "react";
// NOTICE: 'storage' import is removed because we are not using it anymore
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { FaImage, FaSpinner, FaTimes } from "react-icons/fa";

export default function CreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  // Storing the image as a Text String (Base64)
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle File Selection & Convert to String
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file size (Base64 is heavy, keep it under 800KB for Firestore)
      if (file.size > 800 * 1024) {
        alert("File is too big! Please use an image under 800KB.");
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // This result is a long string looking like "data:image/png;base64,..."
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    console.log("Submitting post with image string:", image);

    try {
      // 2. Save directly to Database (No "uploadBytes" call here)
      if (user) {
        await addDoc(collection(db, "posts"), {
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhoto: user.photoURL || null,
          content: content,
          imageURL: image,
          visibility: visibility,
          likes: [],
          commentsCount: 0,
          createdAt: serverTimestamp(),
        });
      }

      // 3. Reset Form
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
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
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
      {image && (
        <div className="relative mb-4 ml-14">
          <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <Image src={image} alt="Preview" fill className="object-cover" />
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
              onChange={handleImageChange}
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
            disabled={loading || (!content && !image)}
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
