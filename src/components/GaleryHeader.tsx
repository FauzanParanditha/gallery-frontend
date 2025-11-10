"use client";

import { Download, Heart, Play, Share2 } from "lucide-react";
import { useState } from "react";

export const GalleryHeader = () => {
  const [activeTab, setActiveTab] = useState("");

  const tabs = ["HIGHLIGHTS", "JCM", "EMPIRE"];

  return (
    <header className="w-full sticky top-0  backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title */}
          <div className="text-left">
            <h1 className="text-lg md:text-2xl font-semibold tracking-wide text-foreground uppercase">
              AKU & KAMU - CINEMA VISIT YOGYAKARTA
            </h1>
            <p className="text-xs md:text-sm tracking-widest text-muted-foreground mt-1">
              PARANDITHA
            </p>
          </div>

          {/* Tabs (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent hover:border-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center justify-start md:justify-end gap-4 text-muted-foreground">
            <Heart className="w-5 h-5 hover:text-foreground cursor-pointer" />
            <Download className="w-5 h-5 hover:text-foreground cursor-pointer" />
            <Share2 className="w-5 h-5 hover:text-foreground cursor-pointer" />
            <Play className="w-5 h-5 hover:text-foreground cursor-pointer" />
          </div>
        </div>

        {/* Tabs (mobile) */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm rounded-none px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
