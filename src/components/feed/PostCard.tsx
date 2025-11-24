/* eslint-disable @typescript-eslint/no-explicit-any */
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
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import LikesModal from "./LikesModal";

export default function PostCard({ post }: { post: any }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [allComments, setAllComments] = useState<any[]>([]);

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);

  const isLiked = user ? post.likes?.includes(user.uid) : false;

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    if (isLiked) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  useEffect(() => {
    if (showComments) {
      const q = query(
        collection(db, `posts/${post.id}/comments`),
        orderBy("createdAt", "asc")
      );
      const unsubscribe = onSnapshot(q, (snap) => {
        setAllComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
      return () => unsubscribe();
    }
  }, [showComments, post.id]);

  const handleCommentSubmit = async (text: string) => {
    if (!user) return;

    await addDoc(collection(db, `posts/${post.id}/comments`), {
      text,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      parentId: null,
      createdAt: serverTimestamp(),
      likes: [],
    });

    await updateDoc(doc(db, "posts", post.id), {
      commentsCount: (post.commentsCount || 0) + 1,
    });
  };

  const rootComments = allComments.filter((c) => !c.parentId);
  const getReplies = (commentId: string) =>
    allComments.filter((c) => c.parentId === commentId);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 relative">
      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        userIds={post.likes || []}
      />

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

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">
        <button
          onClick={() => setIsLikesModalOpen(true)}
          className="flex items-center gap-1 hover:underline cursor-pointer"
        >
          <div className="bg-blue-500 rounded-full p-1 text-white">
            <FaThumbsUp className="text-[8px]" />
          </div>
          <span>{post.likes?.length || 0}</span>
        </button>

        <div>{post.commentsCount || 0} Comments</div>
      </div>

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

      {showComments && (
        <div className="pt-2 border-t border-gray-100">
          <div className="space-y-4 mb-4">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                replies={getReplies(comment.id)}
              />
            ))}
          </div>
          <CommentInput onSubmit={handleCommentSubmit} />
        </div>
      )}
    </div>
  );
}
