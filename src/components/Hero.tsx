import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  onViewGallery?: () => void;
}

export const Hero = ({
  backgroundImage,
  title,
  subtitle,
  onViewGallery,
}: HeroProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-overlay/60 via-overlay/40 to-overlay/60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in duration-1000">
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-primary-foreground mb-4 uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 font-light tracking-wide">
            {subtitle}
          </p>
        )}
        {onViewGallery && (
          <Button
            onClick={onViewGallery}
            variant="outline"
            size="lg"
            className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary transition-all duration-300 px-8 py-6 text-base tracking-wider"
          >
            View Gallery
            <ArrowDown className="ml-2 w-5 h-5 animate-bounce" />
          </Button>
        )}
      </div>
    </section>
  );
};
