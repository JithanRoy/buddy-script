"use client";

import CreatePost from "@/components/feed/CreatePost";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Real-time listener for posts
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#F0F2F5] min-h-screen pt-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar (Desktop Only) */}
          <div className="hidden lg:block col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h4 className="font-bold text-lg mb-4">Explore</h4>
              <ul className="space-y-4 text-gray-600 font-medium">
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-blue-600 bg-blue-50">
                  <span>Feed</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span>Friends</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span>Groups</span>
                </li>
                <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span>Saved</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Feed Area */}
          <div className="col-span-12 lg:col-span-6">
            <CreatePost />

            <div className="mb-10">
              {posts.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  Loading posts...
                </div>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>

          {/* Right Sidebar (Desktop Only) */}
          <div className="hidden lg:block col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h4 className="font-bold text-lg mb-4">Suggested People</h4>
              <div className="space-y-4">
                {/* Dummy Data for sidebar */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                          src={`/assets/images/people${i}.png`}
                          width={40}
                          height={40}
                          alt="User"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">User Name</h5>
                        <p className="text-xs text-gray-500">CEO at Company</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-xs font-bold border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
