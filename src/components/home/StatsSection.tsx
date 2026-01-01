import { TrendingUp, DollarSign, Clock, Award } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '1M+', label: 'Tasks Completed', suffix: '' },
  { icon: DollarSign, value: '2', label: 'Million Paid', suffix: 'M+' },
  { icon: Clock, value: '24/7', label: 'Platform Uptime', suffix: '' },
  { icon: Award, value: '50K+', label: 'Active Users', suffix: '' },
];

const StatsSection = () => {
  return (
    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center animate-scale-in stagger-${index + 1}`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </p>
              <p className="text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
