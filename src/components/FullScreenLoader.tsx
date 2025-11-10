"use client";

import { LoaderIcon } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-50/80">
      <LoaderIcon
        className="h-10 w-10 animate-spin text-gray-800"
        strokeWidth={2}
      />
    </div>
  );
}
