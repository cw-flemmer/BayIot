import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, ChevronRight } from 'lucide-react';

const Hero = ({ navigateToDemo, scrollToSection }) => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[80vh] flex items-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-40"
                >
                    <source src="/video/bgnd_video.mp4" type="video/mp4" />
                </video>
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]/80" />
            </div>

            {/* Background Gradients (Kept for depth) */}
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
                            Turn IoT Monitoring Into Your Product
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            Loss prevention + Compliance + Peace of Mind
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                            BayIoT is a white-label IoT platform that helps you monitor, control, and optimize your devices with our
                            enterprise-ready dashboard and sensor solutions. Real-time data, anytime, anywhere.
                        </p>
                        {/*<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">*/}
                        <div className="hidden">
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
                {/*<motion.div
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
                </motion.div>*/}
            </div>
        </section>
    );
};

export default Hero;
