import { useState } from 'react';
import { useGetHomePageLinks } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { AddHomePageLinkDialog } from './AddHomePageLinkDialog';
import { EditHomePageLinkDialog } from './EditHomePageLinkDialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { HomePageLink } from '../backend';
import { useDeleteHomePageLink } from '../hooks/useQueries';
import { toast } from 'sonner';

export function HomePageLinks() {
  const { data: links, isLoading } = useGetHomePageLinks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<HomePageLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<HomePageLink | null>(null);
  const deleteLink = useDeleteHomePageLink();

  const handleDelete = async () => {
    if (!deletingLink) return;

    try {
      await deleteLink.mutateAsync(deletingLink.id);
      toast.success('Link deleted successfully');
      setDeletingLink(null);
    } catch (error) {
      toast.error('Failed to delete link');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quick Links
          </h2>
          <p className="text-muted-foreground mt-1">
            Important links and resources
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : links && links.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <Card
              key={link.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={link.thumbnail.getDirectURL()}
                    alt={link.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => setEditingLink(link)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-red-600 text-white"
                      onClick={() => setDeletingLink(link)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">
                    {link.title}
                  </h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No links yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </CardContent>
        </Card>
      )}

      <AddHomePageLinkDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {editingLink && (
        <EditHomePageLinkDialog
          open={!!editingLink}
          onOpenChange={(open) => !open && setEditingLink(null)}
          link={editingLink}
        />
      )}

      <AlertDialog open={!!deletingLink} onOpenChange={(open) => !open && setDeletingLink(null)}>
        <AlertDialogContent className="bg-[#1a0a2e] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Link</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{deletingLink?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black/40 border-white/10 text-white hover:bg-black/60">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLink.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLink.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
