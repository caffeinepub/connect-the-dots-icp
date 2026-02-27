import { useState } from 'react';
import { useAddArticle } from '../hooks/useQueries';
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

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddArticleDialog({ open, onOpenChange }: AddArticleDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const addArticleMutation = useAddArticle();
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AddArticleDialog] Form submission started', { timestamp: new Date().toISOString() });

    if (!title || !url || !thumbnailFile) {
      console.error('[AddArticleDialog] Validation failed - missing fields', { title, url, hasThumbnail: !!thumbnailFile });
      toast.error('Please fill in all fields');
      return;
    }

    console.log('[AddArticleDialog] Actor readiness check', { actorReady: !!actor });
    if (!actor) {
      console.error('[AddArticleDialog] Actor not ready');
      toast.error('Backend connection not ready. Please wait a moment and try again.');
      return;
    }

    try {
      console.log('[AddArticleDialog] Processing thumbnail file', { 
        fileName: thumbnailFile.name, 
        fileSize: thumbnailFile.size,
        fileType: thumbnailFile.type 
      });

      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('[AddArticleDialog] Thumbnail converted to Uint8Array', { byteLength: uint8Array.length });

      const thumbnail = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        console.log('[AddArticleDialog] Upload progress', { percentage });
        setUploadProgress(percentage);
      });
      console.log('[AddArticleDialog] ExternalBlob created successfully');

      console.log('[AddArticleDialog] Invoking mutation with params:', { 
        title, 
        url, 
        thumbnailType: typeof thumbnail,
        hasThumbnail: !!thumbnail 
      });

      // Call the mutation and wait for it to complete
      await addArticleMutation.mutateAsync({ title, url, thumbnail });
      
      console.log('[AddArticleDialog] Mutation completed successfully');
      toast.success('Article added successfully!');
      
      // Reset form
      setTitle('');
      setUrl('');
      setThumbnailFile(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add article';
      console.error('[AddArticleDialog] Error in submission flow', { 
        error, 
        errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      toast.error(errorMessage);
    }
  };

  const isSubmitDisabled = addArticleMutation.isPending || !actor;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Add New Article
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share an article showcasing ICP progress
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
              disabled={addArticleMutation.isPending}
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
              disabled={addArticleMutation.isPending}
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
              disabled={addArticleMutation.isPending}
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
              disabled={addArticleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white disabled:opacity-50"
            >
              {addArticleMutation.isPending ? (
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
