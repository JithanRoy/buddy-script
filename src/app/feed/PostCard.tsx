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

export default function PostCard({ post }: { post: any }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<unknown[]>([]);

  // Check if current user liked this post
  const isLiked = user ? post.likes?.includes(user.uid) : false;

  // 1. Toggle Like
  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    if (isLiked) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  // 2. Fetch Comments Real-time (only when section is open)
  useEffect(() => {
    if (showComments) {
      const q = query(
        collection(db, `posts/${post?.id}/comments`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    }
  }, [showComments, post?.id]);

  // 3. Add Comment
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    await addDoc(collection(db, `posts/${post?.id}/comments`), {
      text: commentText,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      createdAt: serverTimestamp(),
    });

    // Increment comment count
    await updateDoc(doc(db, "posts", post?.id), {
      commentsCount: (post?.commentsCount || 0) + 1,
    });

    setCommentText("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 relative overflow-hidden">
          <Image
            src={post.authorPhoto || "/assets/images/profile.png"}
            alt={post.authorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">{post.authorName}</h4>
          <p className="text-xs text-gray-500">
            {post.createdAt
              ? formatDistanceToNow(post.createdAt.toDate(), {
                  addSuffix: true,
                })
              : "Just now"}
            <span className="mx-1">•</span>
            <span className="capitalize">{post.visibility}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
        {post.content}
      </p>

      {post.imageURL && (
        <div className="mb-3 relative w-full h-64 sm:h-80 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={post.imageURL}
            alt="Post content"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Reaction Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 rounded-full p-1">
            <FaThumbsUp className="text-white text-[8px]" />
          </div>
          <span>{post.likes?.length || 0} Likes</span>
        </div>
        <div>{post.commentsCount || 0} Comments</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium ${
            isLiked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />} Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-600"
        >
          <FaComment /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-600">
          <FaShare /> Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-2 border-t border-gray-100">
          <form onSubmit={submitComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </form>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 relative overflow-hidden shrink-0">
                  <Image
                    src={comment.authorPhoto || "/assets/images/profile.png"}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-gray-100 rounded-2xl px-3 py-2">
                  <h6 className="font-bold text-xs text-gray-900">
                    {comment.authorName}
                  </h6>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
