import { useState } from 'react';
import { useAddCybercrimeArticle } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface AddCybercrimeArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCybercrimeArticleDialog({ open, onOpenChange }: AddCybercrimeArticleDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const addArticle = useAddCybercrimeArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url || !thumbnailFile) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const thumbnail = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addArticle.mutateAsync({ title, url, thumbnail });
      
      toast.success('Article added successfully!');
      setTitle('');
      setUrl('');
      setThumbnailFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add article');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Add Cybercrime Article
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share an article about the global cybercrime crisis
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Article Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">Article URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-white">Thumbnail Image</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="bg-black/40 border-white/10 text-white file:text-white"
            />
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addArticle.isPending}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            >
              {addArticle.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Article'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
