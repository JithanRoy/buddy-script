"use client";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: string[];
}

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
}

export default function LikesModal({
  isOpen,
  onClose,
  userIds,
}: LikesModalProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userIds.length > 0) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const userPromises = userIds.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              return userDoc.data() as UserData;
            }
            return null;
          });

          const results = await Promise.all(userPromises);
          setUsers(results.filter((u): u is UserData => u !== null));
        } catch (error) {
          console.error("Error fetching likes:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [isOpen, userIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg text-gray-800">
            People who liked this
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No likes yet.</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.uid} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0 border border-gray-100">
                    <Image
                      src={user.photoURL || "/assets/images/profile.png"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
