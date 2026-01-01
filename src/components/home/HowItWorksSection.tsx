import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: '01',
    title: 'Create Account',
    description: 'Sign up as a Worker or Buyer in less than a minute with just your email.',
  },
  {
    step: '02',
    title: 'Browse Tasks',
    description: 'Workers explore available tasks. Buyers create and post new tasks for workers.',
  },
  {
    step: '03',
    title: 'Complete & Earn',
    description: 'Workers submit tasks for review. Upon approval, coins are credited instantly.',
  },
  {
    step: '04',
    title: 'Withdraw Money',
    description: 'Convert your coins to real money and withdraw through your preferred method.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start earning in 4 simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`relative animate-slide-up stagger-${index + 1}`}
              >
                {/* Step number */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <span className="font-display text-xl font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 animate-slide-up">
          <Link to="/register">
            <Button variant="hero" size="lg" className="gap-2 group">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
