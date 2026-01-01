import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6 animate-bounce-gentle">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Start Earning Today</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Ready to Start{' '}
            <span className="text-gradient-primary">Earning?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
            Join thousands of workers and buyers on the most trusted micro-tasking platform. 
            Sign up now and get bonus coins to kickstart your journey!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
            <Link to="/register">
              <Button variant="accent" size="xl" className="gap-2 group">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl">
                I Already Have an Account
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground animate-fade-in stagger-3">
            No credit card required • Free bonus coins on signup • Instant task access
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
