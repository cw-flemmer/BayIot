import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const AboutUs = () => {
    return (
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
    );
};

export default AboutUs;
