import Hero from "@/components/home/Hero";
import ServicesHighlights from "@/components/home/ServicesHighlights";
import Benefits from "@/components/home/Benefits";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesHighlights />
      <Benefits />
      <Testimonials />
      <CTASection />
    </>
  );
}
