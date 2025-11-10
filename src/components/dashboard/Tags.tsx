import { Card } from "@/components/ui/card";
import { Tags as TagsIcon } from "lucide-react";

const Tags = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your photo tags
        </p>
      </div>

      <Card className="p-16 text-center">
        <TagsIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No tags yet</h3>
        <p className="text-muted-foreground">
          Add tags to your photos to organize them better
        </p>
      </Card>
    </div>
  );
};

export default Tags;
