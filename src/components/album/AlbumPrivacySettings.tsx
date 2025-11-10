import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface AlbumPrivacy {
  isPublic: boolean;
  allowDownload: boolean;
  allowShare: boolean;
  watermarkOn: boolean;
  accessCode: string;
}

interface AlbumPrivacySettingsProps {
  privacy: AlbumPrivacy;
  onPrivacyChange: (privacy: AlbumPrivacy) => void;
}

export const AlbumPrivacySettings = ({
  privacy,
  onPrivacyChange,
}: AlbumPrivacySettingsProps) => {
  const updatePrivacy = (updates: Partial<AlbumPrivacy>) => {
    onPrivacyChange({ ...privacy, ...updates });
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Privacy Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="isPublic">Public Album</Label>
          <Switch
            id="isPublic"
            checked={privacy.isPublic}
            onCheckedChange={(checked) => updatePrivacy({ isPublic: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allowDownload">Allow Download</Label>
          <Switch
            id="allowDownload"
            checked={privacy.allowDownload}
            onCheckedChange={(checked) =>
              updatePrivacy({ allowDownload: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allowShare">Allow Sharing</Label>
          <Switch
            id="allowShare"
            checked={privacy.allowShare}
            onCheckedChange={(checked) =>
              updatePrivacy({ allowShare: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="watermarkOn">Watermark</Label>
          <Switch
            id="watermarkOn"
            checked={privacy.watermarkOn}
            onCheckedChange={(checked) =>
              updatePrivacy({ watermarkOn: checked })
            }
          />
        </div>
        {!privacy.isPublic && (
          <div className="space-y-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              id="accessCode"
              placeholder="Optional access code"
              value={privacy.accessCode}
              onChange={(e) => updatePrivacy({ accessCode: e.target.value })}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
