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
import { storyService } from "./services/storyService";

export default async function Home() {
  // Fetch dynamic data in parallel
  const [featuredData, bestSellersData, adsData, storyData] = await Promise.all([
    productService.getFeaturedProducts().catch(() => ({ data: [] })),
    productService.getBestSellers().catch(() => ({ data: [] })),
    adService.getActiveAds().catch(() => ({ data: [] })),
    storyService.getStory().catch(() => ({ data: null }))
  ]);

  const featuredProducts = featuredData.data || [];
  const bestSellers = bestSellersData.data || [];
  const ads = adsData.data || [];
  const story = storyData.data || null;

  return (
    <>
      <Header />
      
      <main className="flex-1 w-full">
        <FeaturedAds ads={ads} />
        <Hero ads={ads} />
        <FeaturedCollection products={featuredProducts} />
        <BestSellers products={bestSellers} />
        <OurStory story={story} />
        <WhyChooseAuriq />
        <ContactFeedback />
      </main>

      <Footer />
    </>
  );
}
