import { useState } from 'react';
import { useGetMissionContent } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Target } from 'lucide-react';
import { EditMissionDialog } from './EditMissionDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function MissionPage() {
  const { data: missionContent, isLoading } = useGetMissionContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Our Mission
          </h2>
          <p className="text-muted-foreground mt-1">
            Why this matters
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Mission
        </Button>
      </div>

      {isLoading ? (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : missionContent ? (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="p-8 space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                {missionContent.title}
              </h3>
              <p className="text-lg text-white/90 whitespace-pre-wrap leading-relaxed">
                {missionContent.description}
              </p>
            </div>
            
            {missionContent.images && missionContent.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {missionContent.images.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg border border-white/10">
                    <img
                      src={image.getDirectURL()}
                      alt={`Mission image ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-purple-400/50 mb-4" />
            <p className="text-muted-foreground mb-4">No mission content yet. Add your mission statement!</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Add Mission
            </Button>
          </CardContent>
        </Card>
      )}

      <EditMissionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
