import { useState } from 'react';
import { useGetAllWisdom, useDeleteWisdom } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Quote, Pencil, Trash2 } from 'lucide-react';
import { AddWisdomDialog } from './AddWisdomDialog';
import { EditWisdomDialog } from './EditWisdomDialog';
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
import type { Wisdom } from '../backend';

export function InvestingWisdom() {
  const { data: wisdom, isLoading } = useGetAllWisdom();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWisdom, setEditingWisdom] = useState<Wisdom | null>(null);
  const [deletingWisdom, setDeletingWisdom] = useState<Wisdom | null>(null);
  const deleteWisdom = useDeleteWisdom();

  const handleDelete = async () => {
    if (!deletingWisdom) return;
    await deleteWisdom.mutateAsync(deletingWisdom.id);
    setDeletingWisdom(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Investing Wisdom
          </h2>
          <p className="text-muted-foreground mt-1">
            Motivational stories and quotes for the journey
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Wisdom
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : wisdom && wisdom.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wisdom.map((item) => (
            <Card
              key={item.id}
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-4 left-4 opacity-10">
                <Quote className="w-16 h-16 text-purple-400" />
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/10"
                  onClick={() => setEditingWisdom(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-red-600/20"
                  onClick={() => setDeletingWisdom(item)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-6 relative">
                <blockquote className="text-lg text-white mb-4 italic leading-relaxed">
                  "{item.quote}"
                </blockquote>
                <p className="text-sm text-white font-medium">
                  — {item.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No wisdom yet. Add your first one!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Wisdom
            </Button>
          </CardContent>
        </Card>
      )}

      <AddWisdomDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {editingWisdom && (
        <EditWisdomDialog
          open={!!editingWisdom}
          onOpenChange={(open) => !open && setEditingWisdom(null)}
          wisdom={editingWisdom}
        />
      )}

      <AlertDialog open={!!deletingWisdom} onOpenChange={(open) => !open && setDeletingWisdom(null)}>
        <AlertDialogContent className="bg-[#1a0a2e] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Wisdom</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this wisdom entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black/40 border-white/10 text-white hover:bg-black/60">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteWisdom.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteWisdom.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
