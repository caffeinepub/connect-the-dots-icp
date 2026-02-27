import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function AdditionalResources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Additional Resources
          </h2>
          <p className="text-muted-foreground mt-1">
            More helpful resources and information
          </p>
        </div>
      </div>

      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="w-16 h-16 text-purple-400/50 mb-4" />
          <p className="text-muted-foreground mb-2">Additional resources coming soon</p>
          <p className="text-sm text-muted-foreground">This section will be populated with more helpful content</p>
        </CardContent>
      </Card>
    </div>
  );
}
