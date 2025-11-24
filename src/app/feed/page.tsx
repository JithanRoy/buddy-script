"use client";

import CreatePost from "@/components/feed/CreatePost";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import PostCard from "./PostCard";
import RightSidebar from "./RightSidebar";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch posts ordered by newest first
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Fixed Width (Explore) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <LeftSidebar />
          </div>
        </div>

        {/* Center Feed - Flexible Width */}
        <div className="col-span-1 lg:col-span-6">
          <CreatePost />

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
                No posts yet. Be the first to post!
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        {/* Right Sidebar - Fixed Width (Suggestions) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
