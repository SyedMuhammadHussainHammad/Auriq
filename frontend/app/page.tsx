import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import FeaturedAds from "./components/home/FeaturedAds";
import FeaturedCollection from "./components/home/FeaturedCollection";
import BestSellers from "./components/home/BestSellers";
import OurStory from "./components/home/OurStory";
import WhyChooseAuriq from "./components/home/WhyChooseAuriq";
import ContactFeedback from "./components/home/ContactFeedback";
import { productService } from "./services/productService";
import { adService } from "./services/adService";

export default async function Home() {
  // Fetch dynamic data in parallel
  const [featuredData, bestSellersData, adsData] = await Promise.all([
    productService.getFeaturedProducts().catch(() => ({ data: [] })),
    productService.getBestSellers().catch(() => ({ data: [] })),
    adService.getActiveAds().catch(() => ({ data: [] }))
  ]);

  const featuredProducts = featuredData.data || [];
  const bestSellers = bestSellersData.data || [];
  const ads = adsData.data || [];
  return (
    <>
      <Header />
      
      <main className="flex-1 w-full">
        <FeaturedAds ads={ads} />
        <Hero ads={ads} />
        <FeaturedCollection products={featuredProducts} />
        <BestSellers products={bestSellers} />
        <OurStory />
        <WhyChooseAuriq />
        <ContactFeedback />
      </main>

      <Footer />
    </>
  );
}
