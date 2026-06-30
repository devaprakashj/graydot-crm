import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ServicesSection from '../components/landing/ServicesSection';
import FeaturedWork from '../components/landing/FeaturedWork';
import IndustriesSection from '../components/landing/IndustriesSection';
import ProcessSection from '../components/landing/ProcessSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import SceneBackground from '../components/landing/SceneBackground';
import './Landing.css';

const Landing: React.FC = () => (
  <div className="gd-page">
    {/* Fixed ambient background — sits behind everything */}
    <SceneBackground />

    <Navbar />

    <main style={{ position: 'relative', zIndex: 1 }}>
      <Hero />
      <ServicesSection />
      <FeaturedWork />
      <IndustriesSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>

    <Footer />
  </div>
);

export default Landing;
