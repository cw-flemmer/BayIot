import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';

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
        <AboutUs />
        <ContactUs />
      </main>

      <Footer />
    </div>
  );
};

export default App;
