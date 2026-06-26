import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import HeroSection from "@/components/pharmacy/HeroSection";
import ServicesSection from "@/components/pharmacy/ServicesSection";
import HoursSection from "@/components/pharmacy/HoursSection";
import AccessSection from "@/components/pharmacy/AccessSection";
import PharmacyFooter from "@/components/pharmacy/PharmacyFooter";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PharmacyHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <HoursSection />
        <AccessSection />
      </main>
      <PharmacyFooter />
    </div>
  );
}
