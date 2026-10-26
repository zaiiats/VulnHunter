"use client";

export default function CompanyUrl({ website }: { website: string }) {
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        const url = website.startsWith("http") ? website : `https://${website}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }}
      className="text-xs text-gray-500 font-mono hover:text-accent mb-6 line-clamp-1 cursor-pointer"
    >
      {website}
    </span>
  );
}
