"use client";

import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredPosts = allPosts.filter((post: any) => {
        if (post.visibility === "public") return true;

        if (post.visibility === "private" && user && post.authorId === user.uid)
          return true;
        return false;
      });

      setPosts(filteredPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="container mx-auto px-4 pt-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <LeftSidebar />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6">
          <CreatePost />

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
                No posts available.
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
