import { useState } from 'react';
import { useGetAllCybercrimeArticles } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, AlertTriangle } from 'lucide-react';
import { AddCybercrimeArticleDialog } from './AddCybercrimeArticleDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function CybercrimeAwareness() {
  const { data: articles, isLoading } = useGetAllCybercrimeArticles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Cybercrime Awareness
          </h2>
          <p className="text-muted-foreground mt-1">
            Highlighting the global cybercrime crisis
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
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-red-500/50 transition-all group overflow-hidden"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.thumbnail.getDirectURL()}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
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
                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
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
    </div>
  );
}
