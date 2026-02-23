import { useState } from 'react';
import { useGetAllCybercrimeArticles, useDeleteCybercrimeArticle } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, Pencil, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import { AddCybercrimeArticleDialog } from './AddCybercrimeArticleDialog';
import { EditCybercrimeArticleDialog } from './EditCybercrimeArticleDialog';
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
import type { Article } from '../backend';

export function CybercrimeAwareness() {
  const { data: articles, isLoading, isError, error } = useGetAllCybercrimeArticles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const deleteArticle = useDeleteCybercrimeArticle();

  const handleDelete = async () => {
    if (!deletingArticle) return;
    await deleteArticle.mutateAsync(deletingArticle.id);
    setDeletingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Cybercrime Awareness
          </h2>
          <p className="text-muted-foreground mt-1">
            Stay informed about security threats and scams
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">
            Failed to load cybercrime articles. {error instanceof Error ? error.message : 'Please try again later.'}
          </AlertDescription>
        </Alert>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="bg-black/40 backdrop-blur-xl border-red-500/30 hover:border-red-500/60 transition-all overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.thumbnail.getDirectURL()}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white"
                      onClick={() => setEditingArticle(article)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/60 hover:bg-red-600 text-white"
                      onClick={() => setDeletingArticle(article)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Read More <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No articles yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </CardContent>
        </Card>
      )}

      <AddCybercrimeArticleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {editingArticle && (
        <EditCybercrimeArticleDialog
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
    </div>
  );
}
