import { useState } from 'react';
import { useGetAllSpotlights } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { AddSpotlightDialog } from './AddSpotlightDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function EcosystemSpotlight() {
  const { data: spotlights, isLoading } = useGetAllSpotlights();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Ecosystem Spotlight
          </h2>
          <p className="text-muted-foreground mt-1">
            Highlighting amazing projects and people in the ICP ecosystem
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Spotlight
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : spotlights && spotlights.length > 0 ? (
        <div className="space-y-4">
          {spotlights.map((spotlight) => (
            <Card
              key={spotlight.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl text-white">{spotlight.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(spotlight.timestamp)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white whitespace-pre-wrap">{spotlight.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No spotlights yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Spotlight
            </Button>
          </CardContent>
        </Card>
      )}

      <AddSpotlightDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
