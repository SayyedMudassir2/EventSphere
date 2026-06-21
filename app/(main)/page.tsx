// app/(main)/page.tsx
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import FeaturedEvents from "@/app/components/FeaturedEvents";
import UpcomingEvents from "@/app/components/UpcomingEvents";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <Navbar />
      <Hero />
      <FeaturedEvents />
      <UpcomingEvents />
      <CTASection />
      <Footer />
    </div>
  );
}
