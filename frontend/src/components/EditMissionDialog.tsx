import { useState, useEffect } from 'react';
import { useGetMissionContent, useUpdateMissionContent } from '../hooks/useQueries';
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
import { Loader2, X } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface EditMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMissionDialog({ open, onOpenChange }: EditMissionDialogProps) {
  const { data: missionContent } = useGetMissionContent();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const updateMission = useUpdateMissionContent();

  useEffect(() => {
    if (missionContent) {
      setTitle(missionContent.title);
      setDescription(missionContent.description);
    }
  }, [missionContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const images: ExternalBlob[] = [];
      
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const image = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
            const totalProgress = ((i + percentage / 100) / imageFiles.length) * 100;
            setUploadProgress(Math.round(totalProgress));
          });
          images.push(image);
        }
      }

      await updateMission.mutateAsync({ title, description, images });
      
      toast.success('Mission updated successfully!');
      setImageFiles([]);
      setUploadProgress(0);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update mission');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Edit Mission Content
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your mission statement and add images to explain why this matters
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter mission title"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your mission and why it matters..."
              className="bg-black/40 border-white/10 min-h-[200px] text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="images" className="text-white">Images (Optional)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="bg-black/40 border-white/10 text-white file:text-white"
            />
            {imageFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-black/20 p-2 rounded">
                    <span className="text-sm text-white/70 truncate flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Uploading images...</span>
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
              disabled={updateMission.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {updateMission.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Mission'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
