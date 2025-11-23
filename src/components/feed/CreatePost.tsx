"use client";
import { auth, db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [visibility, setVisibility] = useState("public");

  const handlePost = async () => {
    if (!auth.currentUser) return;
    if (!text && !image) return;

    let imageUrl = "";

    // 1. Upload Image if exists
    if (image) {
      const storageRef = ref(
        storage,
        `posts/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // 2. Add to Firestore
    await addDoc(collection(db, "posts"), {
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName,
      authorPhoto: auth.currentUser.photoURL,
      content: text,
      imageURL: imageUrl,
      visibility: visibility,
      createdAt: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
    });

    setText("");
    setImage(null);
    // Ideally, invalidate React Query cache here to refresh feed
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <textarea
        className="w-full bg-gray-100 rounded p-3 focus:outline-none"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-3">
        <input
          type="file"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
          className="text-sm"
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="border rounded p-1 text-sm"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button
          onClick={handlePost}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}
