import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import PromotionalCards from "./PromotionalCards";

export default function Hero({ ads = [] }: { ads?: any[] }) {
  // Toggle this to test alternative mode
  const showAds = false; 

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full"
        >
          {/* Note: User must place video.mp4 in the public folder */}
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-lux flex-1 flex flex-col items-center justify-center text-center mt-12 mb-16">
        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-bold text-gradient-gold tracking-widest mb-2 drop-shadow-lg">
          AURIQ
        </h1>
        <h2 className="text-xl md:text-2xl font-serif text-gold italic mb-6">
          &quot;Essence In Motion&quot;
        </h2>
        <p className="max-w-2xl text-white/90 text-sm md:text-base leading-relaxed mb-10 drop-shadow-md">
          A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link 
            href="#collection" 
            className="px-10 py-4 bg-white/90 backdrop-blur-sm text-black font-medium tracking-wide hover:bg-gold hover:text-black transition-colors duration-300 text-sm shadow-xl"
          >
            EXPLORE COLLECTION
          </Link>
          <Link 
            href="#story" 
            className="px-10 py-4 border border-white/80 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300 text-sm shadow-xl backdrop-blur-sm"
          >
            OUR STORY
          </Link>
        </div>

        {/* Promotional Cards Overlay */}
        <div className="w-full max-w-7xl mx-auto mt-auto pb-4 md:pb-8">
          <PromotionalCards ads={ads} className="w-full relative z-10" showNoise={false} />
        </div>
      </div>
    </section>
  );
}

