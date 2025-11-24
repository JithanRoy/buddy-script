import Link from "next/link";
import {
  FaBookmark,
  FaNewspaper,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";

export default function LeftSidebar() {
  const menuItems = [
    { icon: FaNewspaper, label: "Feed", href: "/feed", active: true },
    { icon: FaUserFriends, label: "Friends", href: "/friends", active: false },
    { icon: FaUsers, label: "Groups", href: "/groups", active: false },
    { icon: FaBookmark, label: "Saved", href: "/saved", active: false },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h4 className="font-bold text-gray-800 mb-6 text-lg">Explore</h4>
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-medium ${
                item.active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
