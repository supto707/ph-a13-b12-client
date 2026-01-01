import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Earn Money Completing Simple Tasks',
    subtitle: 'Join thousands of workers earning from home with micro-tasks',
    cta: 'Start Earning Today',
    stats: [
      { icon: Users, value: '50K+', label: 'Active Workers' },
      { icon: Coins, value: '$2M+', label: 'Paid Out' },
    ],
  },
  {
    title: 'Get Work Done Fast & Affordable',
    subtitle: 'Access a global workforce for your micro-tasks at scale',
    cta: 'Post Your First Task',
    stats: [
      { icon: CheckCircle, value: '1M+', label: 'Tasks Completed' },
      { icon: Users, value: '10K+', label: 'Happy Buyers' },
    ],
  },
  {
    title: 'Your Skills Are Worth Money',
    subtitle: 'Turn your spare time into a steady income stream',
    cta: 'Join Our Community',
    stats: [
      { icon: Coins, value: '$50+', label: 'Avg. Daily Earning' },
      { icon: CheckCircle, value: '99%', label: 'Approval Rate' },
    ],
  },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-[90vh]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className={`max-w-4xl ${activeIndex === index ? 'animate-slide-up' : ''}`}>
                  <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link to="/register">
                      <Button variant="hero" size="xl" className="gap-2 group">
                        {slide.cta}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="hero-outline" size="xl">
                        Sign In
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-8 md:gap-16">
                    {slide.stats.map((stat, statIndex) => (
                      <div
                        key={statIndex}
                        className={`flex items-center gap-3 ${activeIndex === index ? 'animate-scale-in' : ''}`}
                        style={{ animationDelay: `${0.3 + statIndex * 0.1}s` }}
                      >
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                          <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
