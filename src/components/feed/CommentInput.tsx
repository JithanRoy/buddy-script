"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState } from "react";
import { FaCamera, FaMicrophone, FaPaperPlane } from "react-icons/fa";

interface CommentInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentInput({
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentInputProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div className="flex gap-3 items-start w-full mt-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
        <Image
          src={user?.photoURL || "/assets/images/profile.png"}
          alt="User"
          fill
          className="object-cover"
        />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <div className="bg-gray-100 rounded-2xl flex items-center px-4 py-2">
          <input
            autoFocus={autoFocus}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent border-none outline-none text-sm text-gray-800 w-full placeholder-gray-500"
          />

          {/* Icons (Visual match for design) */}
          <div className="flex items-center gap-3 text-gray-400 ml-2">
            <button type="button" className="hover:text-gray-600">
              <FaMicrophone />
            </button>
            <button type="button" className="hover:text-gray-600">
              <FaCamera />
            </button>
            {text.trim().length > 0 && (
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-700 transition-all transform scale-100 ml-1"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
