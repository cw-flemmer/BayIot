import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Thermometer, Ruler, Activity, Zap } from 'lucide-react';

const Specifications = () => {
    const specs = [
        {
            label: "Connectivity",
            value: "Wifi",
            icon: Wifi,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Sensors",
            value: "2x Digital Temperature Probes",
            icon: Thermometer,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            label: "Range",
            value: "-40°C to +80°C",
            icon: Activity,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        },
        {
            label: "Power",
            value: "230VAC",
            icon: Zap,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }
    ];

    return (
        <section id="specifications" className="py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative justify-center">
                <h2 className="text-2xl md:text-2xl font-bold mb-4 text-center">
                    <span className="text-blue-500">Design.</span>|<span className="text-blue-500">Build.</span>|<span className="text-blue-500">Deploy.</span>
                </h2>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed text-center">
                    We work with our customers to provide solutions tailored specifically to their needs.
                </p>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative group"
                    >
                        {/*<div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />*/}
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4">
                            <img
                                src="/images/BayIot-05.png"
                                alt="BayIot Device Specification"
                                className="w-full h-auto rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Specifications */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl md:text-2xl font-bold mb-4 text-gray-800">
                            Wifi Temperature Sensor (Standard)
                        </h2>

                        <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                            Built for reliability and precision. Our hardware is designed to perform in the most demanding environments.
                        </p>

                        <div className="space-y-1">
                            {specs.map((spec, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                    className="flex items-center p-2 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all hover:bg-blue-500/[0.02] group"
                                >
                                    <div className={`w-14 h-14 rounded-xl ${spec.bg} ${spec.color} flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <spec.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                            {spec.label}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {spec.value}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 p-6 rounded-2xl bg-red-400/10 border border-red-400/20">
                            <p className="text-red-400 text-sm font-medium bg-red-400/10 border border-red-400/20 px-3 py-1 rounded-full inline-block mb-3">
                                Please note
                            </p>
                            <p className="text-black text-sm italic">
                                * 2 Week Lead Time after purchase. We assemble and test all units locally in South Africa, before sending out to the customer.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Specifications;
