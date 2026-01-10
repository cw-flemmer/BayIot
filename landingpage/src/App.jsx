import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Mail, Phone, MapPin, ChevronRight, Menu, X } from 'lucide-react';

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
    // Assuming the dashboard is running on port 5173
    window.location.href = 'http://bayiot.cwf-cloud.co.za';
  };

  const navLinks = [
    { name: 'About Us', id: 'about' },
    { name: 'Contact Us', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-['Outfit'] selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              BayIoT
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={navigateToDemo}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#020617] border-b border-white/5 px-6 py-8 space-y-6"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block text-lg font-medium text-gray-400 hover:text-white w-full text-left"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={navigateToDemo}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold"
            >
              Demo
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 inline-block">
                The Future of IoT Management
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Empower Your Connectivity with <span className="text-blue-500 tracking-tight">BayIoT</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Seamlessly monitor, control, and optimize your IoT devices with our
                enterprise-ready dashboard solution. Real-time data, anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={navigateToDemo}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-bold transition-all flex items-center justify-center group cursor-pointer"
                >
                  Get Started
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-lg font-bold transition-all cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>

          {/* Feature Grid Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Zap, title: "Real-time Analytics", desc: "Instant telemetry updates from all your connected sensors." },
              { icon: Shield, title: "Enterprise Security", desc: "Military-grade encryption for all your device communications." },
              { icon: Cpu, title: "Infinite Scalability", desc: "Easily manage thousands of devices from a single window." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all hover:bg-blue-500/[0.02] group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-transparent border border-white/5 flex items-center justify-center p-12 overflow-hidden">
                <div className="w-full h-full relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-24 h-24 text-blue-500/50" />
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">Innovative IoT Solutions for Modern Business</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                At BayIoT, we believe that the future is connected. Our mission is to provide
                easy-to-use yet powerful tools for businesses to harness the power of their
                IoT data. Whether you're monitoring environmental conditions, tracking assets,
                or optimizing energy usage, BayIoT gives you the insights you need to make
                smarter decisions.
              </p>
              <ul className="space-y-4">
                {[
                  "Customizable Dashboard Widgets",
                  "Multi-tenant Architecture",
                  "Comprehensive API Support",
                  "Automated Alerting Systems"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ready to take your IoT strategy to the next level? Our team is here to help you
              every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Mail, label: "Email Us", info: "contact@bayiot.com" },
              { icon: Phone, label: "Call Us", info: "+27 (0) 12 345 6789" },
              { icon: MapPin, label: "Visit Us", info: "Cape Town, South Africa" }
            ].map((contact, i) => (
              <div key={i} className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500">
                  <contact.icon className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-500 mb-1">{contact.label}</p>
                <p className="font-bold text-gray-200">{contact.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-500">
          <p>© 2026 BayIoT. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
