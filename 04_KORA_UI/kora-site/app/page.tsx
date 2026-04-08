import Hero from "../components/sections/Hero";
import AffordableConstruction from "../components/sections/AffordableConstruction";
import Problem from "../components/sections/Problem";
import HowItWorks from "../components/sections/HowItWorks";
import Features from "../components/sections/Features";
import Demo from "../components/sections/Demo";
import Marketplace from "../components/sections/Marketplace";
import CTA from "../components/sections/CTA";
import Navbar from "../components/sections/Navbar";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <AffordableConstruction />
      <Problem />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <HowItWorks />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Features />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Demo />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <Marketplace />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <CTA />
    </main>
  );
}