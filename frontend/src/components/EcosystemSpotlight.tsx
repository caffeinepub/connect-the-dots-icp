import { useState } from 'react';
import { useGetAllSpotlights, useDeleteSpotlight } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Pencil, ExternalLink, Trash2, Link, ImageOff } from 'lucide-react';
import { AddSpotlightDialog } from './AddSpotlightDialog';
import { EditSpotlightDialog } from './EditSpotlightDialog';
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
import type { Spotlight } from '../backend';

interface EcosystemSpotlightProps {
  isAdmin: boolean;
}

export function EcosystemSpotlight({ isAdmin }: EcosystemSpotlightProps) {
  const { data: spotlights, isLoading } = useGetAllSpotlights();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpotlight, setEditingSpotlight] = useState<Spotlight | null>(null);
  const [deletingSpotlight, setDeletingSpotlight] = useState<Spotlight | null>(null);
  const deleteSpotlight = useDeleteSpotlight();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDelete = async () => {
    if (!deletingSpotlight) return;
    await deleteSpotlight.mutateAsync(deletingSpotlight.id);
    setDeletingSpotlight(null);
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
        {isAdmin && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Spotlight
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10 overflow-hidden">
              <Skeleton className="w-full h-52" />
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
          {spotlights.map((spotlight) => {
            const imageUrl = spotlight.image ? spotlight.image.getDirectURL() : null;

            return (
              <Card
                key={spotlight.id}
                className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all group overflow-hidden"
              >
                {/* Header Photo Banner */}
                {imageUrl ? (
                  <div className="w-full h-52 overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={spotlight.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay at bottom for smooth transition into card */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-purple-900/40 via-black/40 to-cyan-900/40 flex items-center justify-center border-b border-white/5">
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <ImageOff className="w-8 h-8" />
                      <span className="text-xs">No header photo</span>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-xl text-white">{spotlight.title}</CardTitle>
                      {spotlight.link && (
                        <Badge
                          variant="outline"
                          className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 text-xs px-2 py-0.5 flex items-center gap-1"
                        >
                          <Link className="w-3 h-3" />
                          Has Link
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(spotlight.timestamp)}
                      </div>
                      {isAdmin && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/10"
                            onClick={() => setEditingSpotlight(spotlight)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-600/20"
                            onClick={() => setDeletingSpotlight(spotlight)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">{spotlight.content}</p>
                  {spotlight.link && (
                    <a
                      href={spotlight.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-sm text-cyan-300 hover:text-white hover:border-cyan-400/60 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit {spotlight.link}
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Spotlights Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              {isAdmin
                ? 'Start highlighting amazing projects and people in the ICP ecosystem.'
                : 'Check back soon for ecosystem spotlights.'}
            </p>
            {isAdmin && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Spotlight
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <AddSpotlightDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {editingSpotlight && (
        <EditSpotlightDialog
          open={!!editingSpotlight}
          onOpenChange={(open) => !open && setEditingSpotlight(null)}
          spotlight={editingSpotlight}
        />
      )}

      <AlertDialog open={!!deletingSpotlight} onOpenChange={(open) => !open && setDeletingSpotlight(null)}>
        <AlertDialogContent className="bg-[#1a0a2e] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Spotlight</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{deletingSpotlight?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white bg-transparent hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
