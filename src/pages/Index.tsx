import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import BestWorkersSection from '@/components/home/BestWorkersSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <BestWorkersSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
