"use client";

import { useAuth } from "@/context/AuthContext";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { FaImage, FaPaperPlane } from "react-icons/fa";

export default function CreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    setLoading(true);

    try {
      let imageUrl = "";

      // 1. Upload Image to Firebase Storage if selected
      if (image && user) {
        const storageRef = ref(
          storage,
          `posts/${user.uid}/${Date.now()}_${image.name}`
        );
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Save Post Data to Firestore
      if (user) {
        await addDoc(collection(db, "posts"), {
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhoto: user.photoURL || null,
          content: content,
          imageURL: imageUrl,
          visibility: visibility,
          likesCount: 0,
          commentsCount: 0,
          createdAt: serverTimestamp(), // Server-side time
          likes: [], // Array to store userIds who liked
        });
      }

      // 3. Reset Form
      setContent("");
      setImage(null);
      setVisibility("public");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex gap-4 mb-4">
        {/* User Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {/* If user has photo, show it, else show default */}
          <Image
            src={user?.photoURL || "/assets/images/profile.png"}
            width={40}
            height={40}
            alt="Profile"
            className="w-full h-full object-cover"
            unoptimized // Use this if loading external firebase images
          />
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-24"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div className="flex gap-4">
          {/* Image Upload Button */}
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600 transition">
            <FaImage className="text-xl" />
            <span className="text-sm font-medium">Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
            />
          </label>
          {image && (
            <span className="text-xs text-green-600 self-center">
              Image selected: {image.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="bg-gray-100 text-sm border-none rounded-md px-3 py-2 outline-none cursor-pointer"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <button
            onClick={handlePost}
            disabled={loading || (!content && !image)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              "Posting..."
            ) : (
              <>
                <FaPaperPlane /> Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
