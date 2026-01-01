import { ClipboardList, Coins, CreditCard, Shield, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Simple Tasks',
    description: 'Complete easy micro-tasks like surveys, data entry, and content moderation from anywhere.',
    color: 'primary',
  },
  {
    icon: Coins,
    title: 'Instant Earnings',
    description: 'Earn coins for every completed task. Convert them to real money anytime you want.',
    color: 'accent',
  },
  {
    icon: CreditCard,
    title: 'Fast Withdrawals',
    description: 'Withdraw your earnings through multiple payment methods with minimal fees.',
    color: 'success',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and earnings are protected with enterprise-grade security measures.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Instant Approval',
    description: 'Most tasks are approved within minutes. No long waiting periods for your money.',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Work Globally',
    description: 'Access tasks from buyers worldwide. No geographical restrictions on earning.',
    color: 'success',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose MicroTask?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've built the most worker-friendly platform with features that matter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slide-up stagger-${index + 1}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                feature.color === 'primary' ? 'gradient-primary shadow-glow' :
                feature.color === 'accent' ? 'gradient-accent shadow-accent-glow' :
                'bg-success'
              }`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
