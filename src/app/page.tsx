"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, go to feed
        router.push("/feed");
      } else {
        // If not logged in, go to login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Loading State (While Firebase checks session)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}