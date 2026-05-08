import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/sections/PageLoader';
import MobileCTA from '@/components/sections/MobileCTA';
import Hero from '@/components/sections/Hero';
import PinSection from '@/components/sections/PinSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import Showcase from '@/components/sections/Showcase';
import Compare from '@/components/sections/Compare';
import HowItWorks from '@/components/sections/HowItWorks';
import BentoFeatures from '@/components/sections/BentoFeatures';
import ProductPreview from '@/components/sections/ProductPreview';
import ROICalculator from '@/components/sections/ROICalculator';
import Guarantee from '@/components/sections/Guarantee';
import CaseStudies from '@/components/sections/CaseStudies';
import CaseDeep from '@/components/sections/CaseDeep';
import Walkthrough from '@/components/sections/Walkthrough';
import Pricing from '@/components/sections/Pricing';
import CompareVendors from '@/components/sections/CompareVendors';
import Security from '@/components/sections/Security';
import Architecture from '@/components/sections/Architecture';
import Integrations from '@/components/sections/Integrations';
import TrustReport from '@/components/sections/TrustReport';
import About from '@/components/sections/About';
import Limitations from '@/components/sections/Limitations';
import FAQ from '@/components/sections/FAQ';
import FinalCTA from '@/components/sections/FinalCTA';
import ChatWidget from '@/components/ui/ChatWidget';
import RevealObserver from '@/components/ui/RevealObserver';

export default function Home() {
  return (
    <>
      <PageLoader />
      <RevealObserver />
      <Navbar />
      <main id="main-content">
        <Hero />
        <PinSection />
        <MarqueeSection />
        <Showcase />
        <Compare />
        <HowItWorks />
        <BentoFeatures />
        <ProductPreview />
        <ROICalculator />
        <Guarantee />
        <CaseStudies />
        <CaseDeep />
        <Walkthrough />
        <Pricing />
        <CompareVendors />
        <Security />
        <Architecture />
        <Integrations />
        <TrustReport />
        <About />
        <Limitations />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTA />
      <ChatWidget />
    </>
  );
}
