import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Plus, Trash2 } from "lucide-react";

export interface ShareLink {
  id: string;
  url: string;
  expiresOn: string | null;
  createdAt: string;
}

interface AlbumShareLinksProps {
  shareLinks: ShareLink[];
  onGenerateLink: () => void;
  onRevokeLink: (id: string) => void;
}

export const AlbumShareLinks = ({
  shareLinks,
  onGenerateLink,
  onRevokeLink,
}: AlbumShareLinksProps) => {
  const { toast } = useToast();

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard.",
    });
  };

  const isExpired = (expiresOn: string | null) => {
    if (!expiresOn) return false;
    return new Date(expiresOn) < new Date();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Share Links</h3>
        <Button size="sm" onClick={onGenerateLink}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Link
        </Button>
      </div>
      <div className="space-y-3">
        {shareLinks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No share links yet. Generate one to share this album.
          </p>
        ) : (
          shareLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 p-3 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-mono truncate">{link.url}</p>
                  {isExpired(link.expiresOn) && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {link.expiresOn
                    ? `Expires: ${new Date(
                        link.expiresOn
                      ).toLocaleDateString()}`
                    : "No expiration"}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopyLink(link.url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRevokeLink(link.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
