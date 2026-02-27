import { useState } from 'react';
import { useGetAllArticles, useDeleteArticle } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { AddArticleDialog } from './AddArticleDialog';
import { EditArticleDialog } from './EditArticleDialog';
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
import type { Article } from '../backend';

interface LatestProgressProps {
  isAdmin: boolean;
}

export function LatestProgress({ isAdmin }: LatestProgressProps) {
  const { data: articles, isLoading } = useGetAllArticles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const deleteArticle = useDeleteArticle();

  const handleDelete = async () => {
    if (!deletingArticle) return;
    await deleteArticle.mutateAsync(deletingArticle.id);
    setDeletingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Probably Nothing…
          </h2>
          <p className="text-muted-foreground mt-1">
            Real ICP progress that doesn't get mainstream coverage
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all group overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.thumbnail.getDirectURL()}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white"
                        onClick={() => setEditingArticle(article)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-black/60 hover:bg-red-600 text-white"
                        onClick={() => setDeletingArticle(article)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-lg mb-3 line-clamp-2 text-white">
                  {article.title}
                </CardTitle>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Read Article <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No articles yet.</p>
            {isAdmin && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Article
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <>
          <AddArticleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
          {editingArticle && (
            <EditArticleDialog
              open={!!editingArticle}
              onOpenChange={(open) => !open && setEditingArticle(null)}
              article={editingArticle}
            />
          )}
          <AlertDialog open={!!deletingArticle} onOpenChange={(open) => !open && setDeletingArticle(null)}>
            <AlertDialogContent className="bg-[#1a0a2e] border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Article</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  Are you sure you want to delete "{deletingArticle?.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-black/40 border-white/10 text-white hover:bg-black/60">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteArticle.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteArticle.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
