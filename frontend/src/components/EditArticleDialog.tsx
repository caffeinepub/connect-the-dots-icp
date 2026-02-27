import { useState, useEffect } from 'react';
import { useUpdateArticle } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
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
import type { Article } from '../backend';

interface EditArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article;
}

export function EditArticleDialog({ open, onOpenChange, article }: EditArticleDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const updateArticleMutation = useUpdateArticle();
  const { actor } = useActor();

  useEffect(() => {
    if (open && article) {
      setTitle(article.title);
      setUrl(article.url);
      setThumbnailFile(null);
      setUploadProgress(0);
    }
  }, [open, article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!actor) {
      toast.error('Backend connection not ready. Please wait a moment and try again.');
      return;
    }

    try {
      let thumbnail = article.thumbnail;
      
      if (thumbnailFile) {
        const arrayBuffer = await thumbnailFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        thumbnail = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await updateArticleMutation.mutateAsync({ id: article.id, title, url, thumbnail });
      
      toast.success('Article updated successfully!');
      setTitle('');
      setUrl('');
      setThumbnailFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update article';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const isSubmitDisabled = updateArticleMutation.isPending || !actor;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Edit Article
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update article details
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
              disabled={updateArticleMutation.isPending}
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
              disabled={updateArticleMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="text-white">Thumbnail Image (Optional - leave empty to keep current)</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="bg-black/40 border-white/10 text-white file:text-white"
              disabled={updateArticleMutation.isPending}
            />
            {thumbnailFile && (
              <p className="text-sm text-white/70">Selected: {thumbnailFile.name}</p>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          {!actor && (
            <p className="text-sm text-yellow-400">Connecting to backend...</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white"
              disabled={updateArticleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white disabled:opacity-50"
            >
              {updateArticleMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Article'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
