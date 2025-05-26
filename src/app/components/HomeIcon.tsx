// HomeIcon.tsx
import React from "react";

export default function HomeIcon({ className = "w-6 h-6 mr-2" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l9-9 9 9M4.5 10.5V19a1.5 1.5 0 001.5 1.5h3.75m6 0H18a1.5 1.5 0 001.5-1.5v-8.5M9.75 21V15h4.5v6"
      />
    </svg>
  );
}
