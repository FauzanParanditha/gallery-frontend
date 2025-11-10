import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Clock, RefreshCw, Star } from "lucide-react";
import Image from "next/image";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  isFeatured: boolean;
  sortOrder: number;
  status: "pending" | "processing" | "completed" | "error";
  tags: string[];
}

interface PhotoGridProps {
  photos: Photo[];
  onUpdatePhoto: (id: string, updates: Partial<Photo>) => void;
  onRetryUpload: (id: string) => void;
}

const StatusIcon = ({ status }: { status: Photo["status"] }) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "processing":
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export const PhotoGrid = ({
  photos,
  onUpdatePhoto,
  onRetryUpload,
}: PhotoGridProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Photos ({photos.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <Image
                src={photo.url}
                alt={photo.caption || "Photo"}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="secondary" className="gap-1">
                  <StatusIcon status={photo.status} />
                  {photo.status}
                </Badge>
                {photo.isFeatured && (
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-3 space-y-3">
              <Input
                placeholder="Add caption..."
                value={photo.caption}
                onChange={(e) =>
                  onUpdatePhoto(photo.id, { caption: e.target.value })
                }
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={photo.isFeatured}
                    onCheckedChange={(checked) =>
                      onUpdatePhoto(photo.id, { isFeatured: !!checked })
                    }
                  />
                  <label className="text-sm">Featured</label>
                </div>
                <Input
                  type="number"
                  placeholder="Order"
                  value={photo.sortOrder}
                  onChange={(e) =>
                    onUpdatePhoto(photo.id, {
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-20 h-8"
                />
              </div>
              {photo.status === "error" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => onRetryUpload(photo.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
