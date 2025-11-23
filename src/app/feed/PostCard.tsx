"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaComment, FaRegThumbsUp, FaShare, FaThumbsUp } from "react-icons/fa";

interface PostProps {
  post: {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto: string | null;
    content: string;
    imageURL?: string;
    createdAt: any;
    likes: string[];
    commentsCount: number;
    visibility: string;
  };
}

export default function PostCard({ post }: PostProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);

  // Check if current user liked the post
  const hasLiked = user ? post.likes?.includes(user.uid) : false;

  // 1. Handle Like/Unlike
  const toggleLike = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);

    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
        likesCount: post.likes.length - 1,
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
        likesCount: post.likes.length + 1,
      });
    }
  };

  // 2. Fetch Comments (Real-time)
  useEffect(() => {
    if (showComments) {
      const q = query(
        collection(db, `posts/${post.id}/comments`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
      return () => unsubscribe();
    }
  }, [showComments, post.id]);

  // 3. Add Comment
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      await addDoc(collection(db, `posts/${post.id}/comments`), {
        authorId: user.uid,
        authorName: user.displayName,
        authorPhoto: user.photoURL,
        text: commentText,
        createdAt: serverTimestamp(),
      });

      // Update comment count on main post
      await updateDoc(doc(db, "posts", post.id), {
        commentsCount: (post.commentsCount || 0) + 1,
      });

      setCommentText("");
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  // Helper to format date safely
  const getDate = () => {
    if (!post.createdAt) return "Just now";
    return formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <Image
            src={post.authorPhoto || "/assets/images/profile.png"}
            width={40}
            height={40}
            alt="Author"
            unoptimized
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{post.authorName}</h4>
          <p className="text-xs text-gray-500">
            {getDate()} • <span className="capitalize">{post.visibility}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
        {post.imageURL && (
          <div className="rounded-lg overflow-hidden">
            <Image
              src={post.imageURL}
              width={600}
              height={400}
              className="w-full object-cover max-h-[500px]"
              alt="Post Content"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-3 pb-2 border-b">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 p-1 rounded-full">
            <FaThumbsUp className="text-white text-[10px]" />
          </div>
          <span>{post.likes?.length || 0}</span>
        </div>
        <div>
          <span>{post.commentsCount || 0} Comments</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
            hasLiked ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
        >
          {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span>Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-2">
          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              <Image
                src={user?.photoURL || "/assets/images/profile.png"}
                width={32}
                height={32}
                alt="Me"
                unoptimized
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* List Comments */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <Image
                    src={comment.authorPhoto || "/assets/images/profile.png"}
                    width={32}
                    height={32}
                    alt="Commenter"
                    unoptimized
                  />
                </div>
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <h5 className="font-bold text-sm">{comment.authorName}</h5>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
