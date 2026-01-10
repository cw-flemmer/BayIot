import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Menu, X } from 'lucide-react';

const Navbar = ({ isMenuOpen, setIsMenuOpen, navLinks, scrollToSection, navigateToDemo }) => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/*<div className="p-2 bg-blue-500 rounded-lg">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        BayIoT
                    </span>*/}
                    <img src="/images/Logo.png" className='w-50 h-auto' alt="BayIoT" />
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
                        className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold cursor-pointer"
                    >
                        Demo
                    </button>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
