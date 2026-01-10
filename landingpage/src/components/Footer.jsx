import React from 'react';
import { Cpu, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pt-24 pb-12 bg-[#020617] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="p-1.5 bg-blue-500 rounded-lg">
                                <Cpu className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">BayIoT</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Empowering industries with smart, reliable, and scalable IoT monitoring solutions since 2024.
                        </p>
                        <div className="flex space-x-4">
                            {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4">
                            {['Solutions', 'Pricing', 'White Label', 'Documentation'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'API Status', 'Security', 'Contact Engineers'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'SLA Agreement'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <p className="text-xs text-gray-500">
                        © {currentYear} BayIoT. Built for the future of connectivity.
                    </p>
                    <div className="flex space-x-8 text-xs text-gray-500">
                        <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
