import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import FeaturedApp from "./components/FeaturedApp";
import FutureApps from "./components/FutureApps";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main>
        <Header />
        <Hero />
        <Benefits />
        <FeaturedApp />
        <FutureApps />
        <CTA />
        <Pricing />
        <Contact />
        <Footer />
    </main>
    );
}

// redeploy test
