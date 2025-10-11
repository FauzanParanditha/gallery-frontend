"use client";

import heroImage from "@/assets/hero-image.jpg";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";
import photo7 from "@/assets/photo-7.jpg";
import photo8 from "@/assets/photo-8.jpg";
import { GalleryHeader } from "@/components/GaleryHeader";
import { Hero } from "@/components/Hero";
import { PhotoGallery } from "@/components/PhotoGallery";
import { useRef } from "react";

const Index = () => {
  const galleryRef = useRef<HTMLElement>(null);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const photos = [
    { src: photo1.src, alt: "Happy group of people enjoying a cinema visit" },
    {
      src: photo2.src,
      alt: "Close-up portrait of smiling friends at a cinema event",
    },
    { src: photo3.src, alt: "Excited cinema audience with raised hands" },
    {
      src: photo4.src,
      alt: "People walking into theater with ambient lighting",
    },
    {
      src: photo5.src,
      alt: "Wide shot of cinema theater filled with happy audience",
    },
    {
      src: photo6.src,
      alt: "Candid moments of people laughing and enjoying cinema",
    },
    { src: photo7.src, alt: "Group photo of friends at cinema entrance" },
    { src: photo8.src, alt: "Detail shot of cinema audience reactions" },
  ];

  return (
    <main className="min-h-screen">
      <Hero
        backgroundImage={heroImage.src}
        title="Aku & Kamu"
        subtitle="Cinema Visit Yogyakarta"
        onViewGallery={scrollToGallery}
      />

      <section ref={galleryRef} className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          {/* Mobile Layout */}
          {/* <div className="block md:hidden space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-light tracking-wider text-foreground mb-1">
                  Cinema Visit JOGJA
                </h2>
                <p className="text-sm text-muted-foreground">IMAN BRAIN</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
              <Button
                variant="ghost"
                size="sm"
                className="border-b-2 border-foreground rounded-none px-4"
              >
                HIGHLIGHTS
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground rounded-none px-4"
              >
                JCM
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground rounded-none px-4"
              >
                EMPIRE
              </Button>
            </div>
          </div> */}

          {/* Desktop Layout */}
          {/* <div className="hidden md:block">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider text-foreground mb-6">
              Cinema Visit JOGJA
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">IMAN BRAIN</span>
              <span className="hidden sm:inline">|</span>
              <span>Event Photography</span>
              <span className="hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground"
                >
                  Portraits
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground"
                >
                  Weddings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-foreground"
                >
                  Landscapes
                </Button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Love</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div> */}
          <GalleryHeader />
        </div>
        <PhotoGallery photos={photos} />
      </section>

      <footer className="bg-primary text-primary-foreground py-8 text-center">
        <p className="text-sm tracking-wider font-light">
          © 2025 Photo Gallery. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default Index;
