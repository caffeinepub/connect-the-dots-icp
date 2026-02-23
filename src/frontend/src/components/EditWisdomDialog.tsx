import { useState, useEffect } from 'react';
import { useUpdateWisdom } from '../hooks/useQueries';
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
import type { Wisdom } from '../backend';

interface EditWisdomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wisdom: Wisdom;
}

export function EditWisdomDialog({ open, onOpenChange, wisdom }: EditWisdomDialogProps) {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const updateWisdom = useUpdateWisdom();

  useEffect(() => {
    if (open && wisdom) {
      setQuote(wisdom.quote);
      setAuthor(wisdom.author);
    }
  }, [open, wisdom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quote || !author) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateWisdom.mutateAsync({ id: wisdom.id, quote, author });
      
      toast.success('Wisdom updated successfully!');
      setQuote('');
      setAuthor('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update wisdom');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a0a2e] border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Edit Investing Wisdom
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update quote or story
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote" className="text-white">Quote or Story</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter the quote or story..."
              className="bg-black/40 border-white/10 min-h-[120px] text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author" className="text-white">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="bg-black/40 border-white/10 text-white placeholder:text-white/50"
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
              disabled={updateWisdom.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              {updateWisdom.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Wisdom'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
