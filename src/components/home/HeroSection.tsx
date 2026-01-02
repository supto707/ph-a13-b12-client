import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { ArrowRight, Coins, Users, CheckCircle, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Earn Money Completing Simple Tasks',
    subtitle: 'Join thousands of workers earning from home with micro-tasks. Turn your spare time into real cash.',
    cta: 'Start Earning Today',
    stats: [
      { icon: Users, value: '50K+', label: 'Active Workers' },
      { icon: Coins, value: '$2M+', label: 'Paid Out' },
    ],
  },
  {
    title: 'Get Work Done Fast & Affordable',
    subtitle: 'Access a global workforce for your micro-tasks at scale. Quality results in minutes, not days.',
    cta: 'Post Your First Task',
    stats: [
      { icon: CheckCircle, value: '1M+', label: 'Tasks Completed' },
      { icon: Users, value: '10K+', label: 'Happy Buyers' },
    ],
  },
  {
    title: 'Your Skills Are Worth Money',
    subtitle: 'Whether you are a student or a professional, there is a task for everyone to earn extra income.',
    cta: 'Join Our Community',
    stats: [
      { icon: Trophy, value: '$50+', label: 'Avg. Daily Earning' },
      { icon: Star, value: '4.9/5', label: 'User Rating' },
    ],
  },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.08),rgba(10,10,10,1))]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet', // Explicitly defined to avoid conflicts
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            }
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full min-h-[600px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="max-w-5xl mx-auto space-y-8">
                  {/* Floating Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4 ${activeIndex === index ? 'animate-fade-in' : 'opacity-0'}`}>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white/90">Trusted by 50,000+ Users</span>
                  </div>

                  {/* Main Title */}
                  <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1] ${activeIndex === index ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i} className={i % 3 === 1 ? 'text-gradient-primary' : ''}> {word} </span>
                    ))}
                  </h1>

                  {/* Subtitle */}
                  <p className={`text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed ${activeIndex === index ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 ${activeIndex === index ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                    <Link to="/register">
                      <Button size="xl" className="h-14 px-8 text-lg rounded-2xl gap-3 gradient-primary shadow-glow hover:shadow-glow/150 hover:scale-105 transition-all duration-300 border-0 group">
                        {slide.cta}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="xl" className="h-14 px-8 text-lg rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 text-white backdrop-blur-sm transition-all duration-300">
                        Sign In Now
                      </Button>
                    </Link>
                  </div>

                  {/* Stats Cards */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 max-w-3xl mx-auto ${activeIndex === index ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                    {slide.stats.map((stat, statIndex) => (
                      <div
                        key={statIndex}
                        className="glass-card p-4 rounded-2xl flex items-center justify-center gap-4 group hover:border-primary/30"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <stat.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                          <p className="text-sm text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
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

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
