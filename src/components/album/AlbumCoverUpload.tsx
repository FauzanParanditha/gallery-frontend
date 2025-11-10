import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AlbumCoverUploadProps {
  currentCover?: string;
  onCoverChange: (file: File | null) => void;
}

export const AlbumCoverUpload = ({
  currentCover,
  onCoverChange,
}: AlbumCoverUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentCover);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onCoverChange(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onCoverChange(null);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Album Cover</h3>
      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={preview}
            alt="Album cover"
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label htmlFor="cover-upload" className="cursor-pointer">
          <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload cover image
            </p>
          </div>
        </label>
      )}
      <input
        id="cover-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </Card>
  );
};
