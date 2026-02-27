import { useState, useEffect } from 'react';
import { useUpdateSpotlight } from '../hooks/useQueries';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ImagePlus } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import type { Spotlight } from '../backend';

interface EditSpotlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spotlight: Spotlight;
}

export function EditSpotlightDialog({ open, onOpenChange, spotlight }: EditSpotlightDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const updateSpotlight = useUpdateSpotlight();

  useEffect(() => {
    if (open && spotlight) {
      setTitle(spotlight.title);
      setContent(spotlight.content);
      setLink(spotlight.link || '');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    }
  }, [open, spotlight]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      let image = spotlight.image;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await updateSpotlight.mutateAsync({
        id: spotlight.id,
        title,
        content,
        image,
        link: link || null,
      });

      toast.success('Spotlight updated successfully!');
      setTitle('');
      setContent('');
      setLink('');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update spotlight');
      console.error(error);
    }
  };

  // Determine which image URL to show: new preview or existing
  const currentImageUrl = imagePreview || (spotlight?.image ? spotlight.image.getDirectURL() : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Edit Ecosystem Spotlight
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update spotlight details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Photo */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Header Photo</Label>
            {currentImageUrl ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-white/10 group">
                <img
                  src={currentImageUrl}
                  alt="Header preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label
                    htmlFor="image"
                    className="cursor-pointer px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Replace Photo
                  </label>
                </div>
                {imageFile && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white/80 truncate">
                    New: {imageFile.name}
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-white/20 bg-black/20 hover:bg-black/30 hover:border-purple-500/50 cursor-pointer transition-colors"
              >
                <ImagePlus className="w-8 h-8 mb-2 text-white/40" />
                <span className="text-sm text-white/50">Click to upload header photo</span>
                <span className="text-xs text-white/30 mt-1">PNG, JPG, GIF up to 10MB</span>
              </label>
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {!imageFile && currentImageUrl && (
              <p className="text-xs text-white/50">Hover over the image to replace it. Leave unchanged to keep the current photo.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter spotlight title"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about what makes this spotlight worthy..."
              className="bg-black/40 border-white/10 min-h-[150px] text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link" className="text-white">Link (Optional)</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Uploading photo...</span>
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
              disabled={updateSpotlight.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {updateSpotlight.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Spotlight'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
