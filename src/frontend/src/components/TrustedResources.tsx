import { useState } from 'react';
import { useGetAllResources } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';
import { AddResourceDialog } from './AddResourceDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function TrustedResources() {
  const { data: resources, isLoading } = useGetAllResources();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Trusted Resources
          </h2>
          <p className="text-muted-foreground mt-1">
            Favorite and trusted people in the ICP ecosystem
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all"
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">{resource.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Visit Profile <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No resources yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </CardContent>
        </Card>
      )}

      <AddResourceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
