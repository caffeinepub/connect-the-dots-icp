import { useState } from 'react';
import { useGetAllWisdom } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Quote } from 'lucide-react';
import { AddWisdomDialog } from './AddWisdomDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function InvestingWisdom() {
  const { data: wisdom, isLoading } = useGetAllWisdom();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 transition-all relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 opacity-10">
                <Quote className="w-16 h-16 text-purple-400" />
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
    </div>
  );
}
