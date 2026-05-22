"use client";

import { useState } from "react";

type UserAvatarProps = {
  photoURL: string | null | undefined;
  name: string;
  size?: "sm" | "md";
};

export function UserAvatar({ photoURL, name, size = "md" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initial = name.charAt(0).toUpperCase();
  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-sm";

  if (photoURL && !imageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white ring-2 ring-white`}
    >
      {initial}
    </div>
  );
}
