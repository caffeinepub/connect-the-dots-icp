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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddSpotlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSpotlightDialog({ open, onOpenChange }: AddSpotlightDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addSpotlight = useAddSpotlight();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addSpotlight.mutateAsync({ title, content });
      
      toast.success('Spotlight added successfully!');
      setTitle('');
      setContent('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add spotlight');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Add Ecosystem Spotlight
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Highlight an amazing project or person in the ICP ecosystem
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
