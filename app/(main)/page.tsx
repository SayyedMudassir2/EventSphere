import Hero from "@/app/components/Hero";
import FeaturedEvents from "@/app/components/FeaturedEvents";
import UpcomingEvents from "@/app/components/UpcomingEvents";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="w-full space-y-20 sm:space-y-28 lg:space-y-36 pb-16">
      {/* Above-The-Fold Intent Capture */}
      <Hero />

      {/* High-Velocity Social Proof Core */}
      <FeaturedEvents />

      {/* Contextual On-Page Engagement Catalog */}
      <UpcomingEvents />

      {/* Conversion Final Push Vector */}
      <CTASection />

      {/* Semantic Structural Sitemap Navigation */}
      <Footer />
    </div>
  );
}
