import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateHomePageLink } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import type { HomePageLink } from '../backend';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EditHomePageLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: HomePageLink;
}

export function EditHomePageLinkDialog({ open, onOpenChange, link }: EditHomePageLinkDialogProps) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const updateLink = useUpdateHomePageLink();

  useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
    setThumbnailFile(null);
    setUploadProgress(0);
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let thumbnail = link.thumbnail;
      
      if (thumbnailFile) {
        const thumbnailBytes = new Uint8Array(await thumbnailFile.arrayBuffer());
        thumbnail = ExternalBlob.fromBytes(thumbnailBytes).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await updateLink.mutateAsync({ id: link.id, title, url, thumbnail });
      toast.success('Link updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update link');
      console.error('Update link error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Link</DialogTitle>
          <DialogDescription className="text-white/70">
            Update the link information
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter link title"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
              disabled={updateLink.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
              disabled={updateLink.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-white">Thumbnail Image (optional - leave empty to keep current)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="bg-black/40 border-white/10 text-white file:text-white"
                disabled={updateLink.isPending}
              />
              <Upload className="w-5 h-5 text-white/50" />
            </div>
            {thumbnailFile && (
              <p className="text-sm text-white/70">{thumbnailFile.name}</p>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Label className="text-white">Upload Progress</Label>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-white/70">{uploadProgress}%</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateLink.isPending}
              className="bg-black/40 border-white/10 text-white hover:bg-black/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLink.isPending || !title.trim() || !url.trim()}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {updateLink.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Link'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
