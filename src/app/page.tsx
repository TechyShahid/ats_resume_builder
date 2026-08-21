import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TemplateShowcase from '@/components/TemplateShowcase';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TemplateShowcase />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
