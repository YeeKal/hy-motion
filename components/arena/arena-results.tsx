
import { ArenaResultItem } from "@/components/arena/arena-result-card";
import ArenaResultCard from "@/components/arena/arena-result-card";

export interface ArenaResultProps {
  id: string;
  prompt: string;
  timestamp: Date;
  images: ArenaResultItem[];
}

export function ArenaResults({ results }: { results: ArenaResultProps[] }) {
  return (
    <div className="space-y-12">
      {results.map((result) => (
        <div key={result.id} className="space-y-4">
          {/* Prompt Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Prompt: <span className="text-primary">{result.prompt}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {result.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.images.map((img) => (
              <ArenaResultCard key={img.modelId} result={img} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
