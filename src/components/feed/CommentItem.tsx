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
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import CommentInput from "./CommentInput";

interface CommentProps {
  comment: any;
  postId: string;
  replies: any[];
}

export default function CommentItem({
  comment,
  postId,
  replies,
}: CommentProps) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);

  const isLiked = user ? comment.likes?.includes(user.uid) : false;
  const likesCount = comment.likes?.length || 0;

  const handleLike = async () => {
    if (!user) return;
    const commentRef = doc(db, `posts/${postId}/comments`, comment.id);

    if (isLiked) {
      await updateDoc(commentRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(commentRef, { likes: arrayUnion(user.uid) });
    }
  };

  const handleReplySubmit = async (text: string) => {
    if (!user) return;

    const rootParentId = comment.parentId || comment.id;

    await addDoc(collection(db, `posts/${postId}/comments`), {
      text,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      parentId: rootParentId,
      createdAt: serverTimestamp(),
      likes: [],
    });

    setShowReplyInput(false);
  };

  const getLikeText = () => {
    if (likesCount === 0) return "";
    if (likesCount === 1 && isLiked) return "You liked this";
    if (likesCount === 1) return "1 person liked this";
    if (isLiked) return `You and ${likesCount - 1} others`;
    return `${likesCount} people liked this`;
  };

  return (
    <div className="flex gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shrink-0 mt-1">
        <Image
          src={comment.authorPhoto || "/assets/images/profile.png"}
          alt={comment.authorName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
          <h6 className="font-bold text-xs text-gray-900">
            {comment.authorName}
          </h6>
          <p className="text-sm text-gray-800">{comment.text}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 ml-2">
          <button
            onClick={handleLike}
            className={`font-semibold hover:underline ${
              isLiked ? "text-blue-600" : ""
            }`}
          >
            Like
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="font-semibold hover:underline"
          >
            Reply
          </button>

          <span>
            {comment.createdAt
              ? formatDistanceToNow(comment.createdAt.toDate(), {
                  addSuffix: false,
                })
              : "Just now"}
          </span>

          {likesCount > 0 && (
            <span className="flex items-center gap-1 bg-white border border-gray-200 shadow-sm px-1.5 py-0.5 rounded-full ml-2">
              <span className="text-[10px] text-blue-500">❤</span>
              <span className="text-[10px]">{likesCount}</span>
            </span>
          )}
        </div>

        {likesCount > 0 && (
          <div className="ml-2 text-[10px] text-gray-400 mt-0.5">
            {getLikeText()}
          </div>
        )}

        {showReplyInput && (
          <div className="ml-2">
            <CommentInput
              onSubmit={handleReplySubmit}
              placeholder={`Reply to ${comment.authorName}...`}
              autoFocus
            />
          </div>
        )}

        {/* Render Nested Replies */}
        {replies.length > 0 && (
          <div className="mt-2 pl-4 border-l-2 border-gray-200">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                replies={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
