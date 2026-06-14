import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StoryProps {
  story?: {
    subtitle?: string;
    title?: string;
    paragraph1?: string;
    paragraph2?: string;
    image1_url?: string;
    image2_url?: string | null;
  } | null;
}

export default function OurStory({ story }: StoryProps) {
  // Default fallbacks in case API fails or returns empty
  const subtitle = story?.subtitle || "The Heritage";
  const title = story?.title || "Crafting The Essence Of Elegance";
  const paragraph1 = story?.paragraph1 || "Every drop of Auriq is a testament to the art of fine perfumery. We source the rarest, most exquisite ingredients from across the globe—from the fields of Grasse to the deep forests of the East—to create fragrances that are not just scents, but timeless memories.";
  const paragraph2 = story?.paragraph2 || "Our master perfumers blend traditional techniques with modern innovation, ensuring that every bottle holds a symphony of notes that evolve beautifully on your skin throughout the day.";
  const image1 = story?.image1_url || "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop";
  const image2 = story?.image2_url;

  return (
    <section className="py-32 bg-perfume-main relative overflow-hidden" id="story">
      {/* Subtle top structural line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Images */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none h-[450px] md:h-[550px] lg:h-[650px]">
            {/* Primary Image (Image 1) */}
            <div className={`absolute ${image2 ? 'top-0 left-0 w-[80%] h-[80%]' : 'inset-0 w-full h-full'} group overflow-hidden p-2 lux-glass-card rounded-xl z-10 transition-all duration-700`}>
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={image1}
                  alt={title}
                  fill
                  className="object-cover opacity-90 transition-all duration-[2000ms] group-hover:scale-110 group-hover:opacity-100"
                />
                {/* Elegant overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              </div>
            </div>

            {/* Secondary Image (Image 2) */}
            {image2 && (
              <div className="absolute bottom-0 right-0 w-[55%] h-[55%] group overflow-hidden p-2 lux-glass-card rounded-xl z-20 transition-all duration-700 shadow-2xl transform translate-x-4 md:-translate-x-8 translate-y-8 md:-translate-y-12">
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={image2}
                    alt={subtitle}
                    fill
                    className="object-cover opacity-90 transition-all duration-[2000ms] group-hover:scale-110 group-hover:opacity-100"
                  />
                  {/* Elegant overlay mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Story Content */}
          <div className="flex flex-col mt-12 lg:mt-0">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold drop-shadow-sm">{subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold mb-8 font-bold tracking-wide leading-tight drop-shadow-md">
              {title}
            </h2>
            <div className="w-16 h-[2px] bg-gold mb-8 shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
            <p className="text-foreground/80 mb-6 leading-relaxed font-semibold text-sm tracking-wide whitespace-pre-wrap">
              {paragraph1}
            </p>
            <p className="text-foreground/80 mb-10 leading-relaxed font-semibold text-sm tracking-wide whitespace-pre-wrap">
              {paragraph2}
            </p>
            <Link 
              href="#philosophy" 
              className="inline-flex items-center gap-4 text-xs text-foreground/80 font-semibold tracking-[0.2em] hover:text-gold transition-colors w-max uppercase group"
            >
              <span className="flex items-center gap-2">READ FULL STORY <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" /></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
