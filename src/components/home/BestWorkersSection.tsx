import { useState, useEffect } from 'react';
import { Coins, Trophy, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userAPI } from '@/lib/api';

interface TopWorker {
  _id: string;
  name: string;
  coins: number;
  photoUrl: string;
}

const BestWorkersSection = () => {
  const [topWorkers, setTopWorkers] = useState<TopWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const response = await userAPI.getTopWorkers();
        setTopWorkers(response.data);
      } catch (error) {
        console.error('Failed to fetch top workers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopWorkers();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-semibold">Top Performers</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Best Workers This Month
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our top earners who have mastered the art of micro-tasking. Join them and start earning today!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topWorkers.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No worker data available yet.
            </div>
          ) : (
            topWorkers.map((worker, index) => (
              <div
                key={worker._id}
                className={`group relative p-6 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slide-up stagger-${index + 1}`}
              >
                {/* Rank badge */}
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 ${index === 0 ? 'gradient-accent text-accent-foreground shadow-accent-glow' :
                    index === 1 ? 'bg-muted-foreground/20 text-foreground backdrop-blur-sm' :
                      index === 2 ? 'bg-amber-600/20 text-amber-600 backdrop-blur-sm' :
                        'bg-secondary text-muted-foreground'
                  }`}>
                  #{index + 1}
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-2 ring-border group-hover:ring-primary transition-all">
                    <AvatarImage src={worker.photoUrl} alt={worker.name} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {worker.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="coin-badge text-xs">
                        <Coins className="w-3 h-3" />
                        <span>{worker.coins.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar showing relative earnings */}
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${(worker.coins / topWorkers[0].coins) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestWorkersSection;
