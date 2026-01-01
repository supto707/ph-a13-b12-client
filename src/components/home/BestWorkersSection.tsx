import { Coins, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const topWorkers = [
  { name: 'Alex Johnson', coins: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { name: 'Maria Garcia', coins: 11200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
  { name: 'James Wilson', coins: 9800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
  { name: 'Emma Davis', coins: 8500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
  { name: 'Michael Brown', coins: 7200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael' },
  { name: 'Sophie Taylor', coins: 6800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie' },
];

const BestWorkersSection = () => {
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
          {topWorkers.map((worker, index) => (
            <div
              key={worker.name}
              className={`group relative p-6 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slide-up stagger-${index + 1}`}
            >
              {/* Rank badge */}
              <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'gradient-accent text-accent-foreground shadow-accent-glow' :
                index === 1 ? 'bg-muted-foreground/20 text-foreground' :
                index === 2 ? 'bg-amber-600/20 text-amber-600' :
                'bg-secondary text-muted-foreground'
              }`}>
                #{index + 1}
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 ring-2 ring-border group-hover:ring-primary transition-all">
                  <AvatarImage src={worker.avatar} alt={worker.name} />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestWorkersSection;
