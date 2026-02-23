import { useState } from 'react';
import { useGetAllXPosts, useDeleteXPost } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { AddXPostDialog } from './AddXPostDialog';
import { EditXPostDialog } from './EditXPostDialog';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { XPost } from '../backend';

export function XPosts() {
  const { data: posts, isLoading, isError, error } = useGetAllXPosts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<XPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<XPost | null>(null);
  const deletePost = useDeleteXPost();

  const handleDelete = async () => {
    if (!deletingPost) return;
    await deletePost.mutateAsync(deletingPost.id);
    setDeletingPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            X Posts
          </h2>
          <p className="text-muted-foreground mt-1">
            Screenshots of important posts and updates
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-4">
                <Skeleton className="h-64 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">
            Failed to load posts. {error instanceof Error ? error.message : 'Please try again later.'}
          </AlertDescription>
        </Alert>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all group"
            >
              <CardContent className="p-4 space-y-3">
                <div className="relative">
                  <img
                    src={post.image.getDirectURL()}
                    alt="X Post Screenshot"
                    className="w-full rounded-lg border border-white/10"
                  />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => setEditingPost(post)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-red-600 text-white"
                      onClick={() => setDeletingPost(post)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {post.description && (
                  <p className="text-sm text-white">{post.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </CardContent>
        </Card>
      )}

      <AddXPostDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {editingPost && (
        <EditXPostDialog
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          post={editingPost}
        />
      )}

      <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
        <AlertDialogContent className="bg-[#1a0a2e] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black/40 border-white/10 text-white hover:bg-black/60">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletePost.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
