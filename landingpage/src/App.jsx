import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ColdChain from './components/ColdChain';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import LiveSensorStats from './components/LiveSensorStats';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navigateToDemo = () => {
    // Redirect to the dashboard project's login page
    window.location.href = 'http://bayiot.cwf-cloud.co.za';
  };

  const navLinks = [
    { name: 'About Us', id: 'about' },
    { name: 'Solutions', id: 'cold-chain' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Contact Us', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-['Outfit'] selection:bg-blue-500/30">
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navLinks={navLinks}
        scrollToSection={scrollToSection}
        navigateToDemo={navigateToDemo}
      />

      <main>
        <Hero
          navigateToDemo={navigateToDemo}
          scrollToSection={scrollToSection}
        />
        {/* <LiveSensorStats /> */}
        <ColdChain />
        <AboutUs />
        <ContactUs />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
};

export default App;
