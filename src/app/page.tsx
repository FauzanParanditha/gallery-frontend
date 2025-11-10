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
