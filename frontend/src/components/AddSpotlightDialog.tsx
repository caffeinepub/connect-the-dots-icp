import { useState } from 'react';
import { useAddSpotlight } from '../hooks/useQueries';
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

interface AddSpotlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSpotlightDialog({ open, onOpenChange }: AddSpotlightDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const addSpotlight = useAddSpotlight();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImageError(false);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setTitle('');
      setContent('');
      setLink('');
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      setImageError(false);
    }
    onOpenChange(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setImageError(true);
      toast.error('A header photo is required');
      return;
    }

    if (!title || !content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addSpotlight.mutateAsync({ title, content, image, link: link || null });

      toast.success('Spotlight added successfully!');
      handleClose(false);
    } catch (error) {
      toast.error('Failed to add spotlight');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Add Ecosystem Spotlight
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Highlight an amazing project or person in the ICP ecosystem
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Photo - Required, at the top */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">
              Header Photo <span className="text-red-400">*</span>
            </Label>
            {imagePreview ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-white/10 group">
                <img
                  src={imagePreview}
                  alt="Header preview"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label
                    htmlFor="image"
                    className="cursor-pointer px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Change Photo
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                className={`flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  imageError
                    ? 'border-red-500/60 bg-red-500/5 hover:bg-red-500/10'
                    : 'border-white/20 bg-black/20 hover:bg-black/30 hover:border-purple-500/50'
                }`}
              >
                <ImagePlus className={`w-8 h-8 mb-2 ${imageError ? 'text-red-400' : 'text-white/40'}`} />
                <span className={`text-sm ${imageError ? 'text-red-400' : 'text-white/50'}`}>
                  {imageError ? 'Header photo is required' : 'Click to upload header photo'}
                </span>
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
            {imageError && !imagePreview && (
              <p className="text-sm text-red-400">Please upload a header photo to continue.</p>
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
              onClick={() => handleClose(false)}
              className="border-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addSpotlight.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {addSpotlight.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Spotlight'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
