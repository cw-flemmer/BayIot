import React from 'react';
import { motion } from 'framer-motion';

const ColdChain = () => {
    const devices = [
        {
            name: "Temperature Sensor",
            image: "/images/icon-temperature@4x-270x300.png",
            description: "High-precision thermal monitoring for sensitive environments."
        },
        {
            name: "Humidity Sensor",
            image: "/images/Humidity@2x-150x150.png",
            description: "Real-time humidity tracking to prevent moisture damage."
        },
        {
            name: "Air Quality Monitor",
            image: "/images/Air-Quality@2x-150x150.png",
            description: "Monitor CO2, VOCs, and particulate matter for safety."
        },
        {
            name: "Door Sensor",
            image: "/images/icon-door-sensor.png",
            description: "Instant alerts for unauthorized access or open fridge doors."
        },
        {
            name: "Water Leak Detector",
            image: "/images/Water-Moisture@2x-150x150.png",
            description: "Detect leaks early to prevent catastrophic infrastructure damage."
        },
        {
            name: "Frequency & Vibration",
            image: "/images/icon-frequency@4x-1-300x252.png",
            description: "Monitor machinery health and structural integrity."
        }
    ];

    return (
        <section id="cold-chain" className="py-24 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">Solutions</h2>
                    <h3 className="text-4xl font-bold mb-4 text-white">Cold Chain & Environmental Monitoring</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Our specialized sensors provide unparalleled visibility into your most critical assets and environments.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {devices.map((device, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-blue-500/[0.03] hover:border-blue-500/30 transition-all group text-center"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <img
                                    src={device.image}
                                    alt={device.name}
                                    className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110"
                                />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white">{device.name}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{device.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ColdChain;
