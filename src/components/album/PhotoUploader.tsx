import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface PhotoUploaderProps {
  onPhotosUpload: (files: File[]) => void;
}

export const PhotoUploader = ({ onPhotosUpload }: PhotoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) {
      toast({
        title: "No valid images",
        description: "Please upload image files only.",
        variant: "destructive",
      });
      return;
    }

    onPhotosUpload(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onPhotosUpload(files);
    }
  };

  return (
    <Card className="p-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-medium mb-1">Drag and drop photos here</p>
            <p className="text-sm text-muted-foreground mb-3">
              or click to browse
            </p>
          </div>
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            Select Photos
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
};
