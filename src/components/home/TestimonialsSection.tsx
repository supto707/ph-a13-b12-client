import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Jennifer Martinez',
    role: 'Freelance Worker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer',
    quote: 'MicroTask has completely changed how I earn extra income. The tasks are simple, payments are reliable, and I love the flexibility!',
    rating: 5,
  },
  {
    name: 'Robert Chen',
    role: 'Digital Marketing Agency',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    quote: 'As a buyer, I can get thousands of micro-tasks done in hours. The quality of workers on this platform is outstanding.',
    rating: 5,
  },
  {
    name: 'Amanda Thompson',
    role: 'Stay-at-Home Mom',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda',
    quote: 'Perfect for earning while taking care of my kids. I complete tasks during nap time and have earned over $500 this month!',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Small Business Owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    quote: 'The platform is intuitive and the support team is incredibly helpful. Best investment for my business growth.',
    rating: 4,
  },
  {
    name: 'Lisa Anderson',
    role: 'College Student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    quote: 'I fund my education through micro-tasks. It fits perfectly around my class schedule and the earnings are substantial.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Quote className="w-4 h-4" />
            <span className="text-sm font-semibold">Testimonials</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who have transformed their income with MicroTask
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="h-full p-6 rounded-2xl bg-card border shadow-soft hover:shadow-medium transition-all duration-300">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-primary-foreground" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted'}`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;
