"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaBell,
  FaCommentDots,
  FaHome,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F0F2F5]">
        {/* Navigation Bar */}
        <nav className="bg-white sticky top-0 z-50 shadow-sm px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo & Search */}
            <div className="flex items-center gap-4">
              <Link href="/feed">
                <Image
                  src="/assets/images/logo.svg"
                  width={100}
                  height={100}
                  alt="Logo"
                />
              </Link>
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-48"
                />
              </div>
            </div>

            {/* Center Icons (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/feed"
                className="text-blue-600 text-2xl border-b-2 border-blue-600 pb-1"
              >
                <FaHome />
              </Link>
              <Link
                href="/friends"
                className="text-gray-400 text-2xl hover:text-blue-600 transition"
              >
                <FaUserFriends />
              </Link>
              <Link
                href="/messages"
                className="text-gray-400 text-xl hover:text-blue-600 transition"
              >
                <FaCommentDots />
              </Link>
            </div>

            {/* Right Profile & Notifications */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <FaBell className="text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  6
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                    <Image
                      src={user?.photoURL || "/assets/images/profile.png"}
                      width={36}
                      height={36}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <div className="px-4 py-2 border-b">
                      <p className="font-bold text-sm text-gray-800">
                        {user?.displayName || "User"}
                      </p>
                      <Link
                        href="/profile"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Profile
                      </Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
