import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import PromotionalCards from "./PromotionalCards";

// Mock data for advertisements (Admin manageable in future)
const advertisements = [
  {
    id: 1,
    title: "The Midnight Collection",
    subtitle: "New Arrival",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
    cta: "DISCOVER NOW",
    url: "#",
  },
  {
    id: 2,
    title: "Summer Exclusives",
    subtitle: "Limited Edition",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
    cta: "SHOP SALE",
    url: "#",
  }
];

// Mock data for fallback featured perfumes
const featuredPerfumes = [
  {
    id: 1,
    name: "Royal Oud",
    brand: "Auriq",
    price: "Rs. 15,000",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Tuscan Leather",
    brand: "Auriq",
    price: "Rs. 12,800",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Baccarat Rouge",
    brand: "Auriq",
    price: "Rs. 18,200",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop",
  }
];

export default function Hero() {
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
          <PromotionalCards className="w-full relative z-10" showNoise={false} />
        </div>
      </div>
    </section>
  );
}

