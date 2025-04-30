import React from "react";
import Header from "../../components/Landing/Header";
import CallToAction from "../../components/Landing/CallToAction";
import Features from "../../components/Landing/Features";
import Footer from "../../components/Landing/Footer";
import Hero from "../../components/Landing/Hero";
import HowItWorks from "../../components/Landing/HowItWorks";
import Testimonials from "../../components/Landing/Testimonials";

const Landing: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Landing;
