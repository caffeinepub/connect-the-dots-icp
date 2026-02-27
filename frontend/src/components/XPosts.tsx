import { useState } from 'react';
import { useGetAllXPosts, useDeleteXPost } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
import type { XPost } from '../backend';

interface XPostsProps {
  isAdmin: boolean;
}

export function XPosts({ isAdmin }: XPostsProps) {
  const { data: posts, isLoading } = useGetAllXPosts();
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
            X Posts Gallery
          </h2>
          <p className="text-muted-foreground mt-1">
            Screenshots of favorite X posts about ICP
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        )}
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
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all group overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={post.image.getDirectURL()}
                    alt={post.description || 'X Post'}
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white"
                        onClick={() => setEditingPost(post)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-black/60 hover:bg-red-600 text-white"
                        onClick={() => setDeletingPost(post)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {post.description && (
                  <div className="p-4">
                    <p className="text-sm text-white">{post.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            {isAdmin && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Post
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <>
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
        </>
      )}
    </div>
  );
}
