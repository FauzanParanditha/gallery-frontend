import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Download, Heart, Share2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Photo {
  src: string;
  alt: string;
  className?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group relative overflow-hidden cursor-pointer bg-muted rounded-sm"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={100}
              height={100}
              className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${
                photo.className || ""
              }`}
              loading="lazy"
            />

            {/* Overlay effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

            {/* Bottom-right buttons */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[10px] group-hover:translate-y-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-transparent hover:bg-black/60 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle like
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-transparent hover:bg-black/60 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-transparent hover:bg-black/60 text-white hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog preview */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {selectedPhoto?.alt}
            </DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {selectedPhoto && (
            <div className="flex items-center justify-center w-full h-full p-8">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                width={500}
                height={500}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
