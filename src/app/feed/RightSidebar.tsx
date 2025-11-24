import Image from "next/image";

export default function RightSidebar() {
  const suggestions = [
    {
      id: 1,
      name: "Steve Jobs",
      role: "CEO at Apple",
      img: "/assets/images/people1.png",
    },
    {
      id: 2,
      name: "Elon Musk",
      role: "CEO at Tesla",
      img: "/assets/images/people2.png",
    },
    {
      id: 3,
      name: "Dylan Field",
      role: "CEO at Figma",
      img: "/assets/images/people3.png",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h4 className="font-bold text-gray-800 mb-6 text-lg">Suggested People</h4>
      <div className="space-y-6">
        {suggestions.map((person) => (
          <div key={person.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                {/* Fallback if image missing, or use real image */}
                <Image
                  src={person.img}
                  alt={person.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <h5 className="font-bold text-sm text-gray-900">
                  {person.name}
                </h5>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
            </div>
            <button className="text-blue-600 text-xs font-semibold border border-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50 transition">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
