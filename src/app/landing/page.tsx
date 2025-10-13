
import React from 'react';
import HeroSection from '../../sections/landing/HeroSection/HeroSection';
import FeaturesSection from '../../sections/landing/FeaturesSection/FeaturesSection';
import HowItWorksSection from '../../sections/landing/HowItWorksSection/HowItWorksSection';
import TestimonialsSection from '../../sections/landing/TestimonialsSection/TestimonialsSection';
import PricingSection from '../../sections/landing/PricingSection/PricingSection';
import CTASection from '../../sections/landing/CTASection/CTASection';
import FAQSection from '../../sections/landing/FAQSection/FAQSection';
import FooterSection from '../../sections/landing/FooterSection/FooterSection';

function page() {
  return (
    <div>
      <HeroSection/>
      <FeaturesSection/>
      <HowItWorksSection/>
      <TestimonialsSection/>
      <PricingSection/>
      <CTASection/>
      <FAQSection/>
      <FooterSection/>
    </div>
  )
}

export default page
