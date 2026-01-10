import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DeviceCard = ({ device, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const isAvailable = device.status === 'Available';

    return (
        <div
            className="relative h-[450px] w-full perspective-1000 cursor-pointer group"
            onClick={handleFlip}
        >
            <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Front Side */}
                <div
                    className={`absolute flex flex-col items-center justify-between p-8 rounded-3xl border backface-hidden h-full w-full ${isAvailable
                            ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30 group-hover:border-blue-500/50 group-hover:bg-blue-500/[0.08]"
                            : "bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 group-hover:border-orange-500/50 group-hover:bg-orange-500/[0.08]"
                        }`}
                >
                    {/* Status Tag */}
                    <div className={`absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-20 ${isAvailable
                            ? "bg-blue-500 text-white shadow-blue-500/20"
                            : "bg-orange-500 text-white border border-white/10"
                        }`}>
                        {device.status}
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className={`absolute inset-0 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isAvailable ? "bg-blue-500/20" : "bg-orange-500/20"
                                }`} />
                            <img
                                src={device.image}
                                alt={device.name}
                                className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110"
                            />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-white">{device.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">{device.description}</p>
                    </div>

                    {isAvailable && (
                        <a
                            href="https://shop.cwf-cloud.co.za/category/4"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2.5 border border-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 z-10"
                        >
                            Buy Now
                        </a>
                    )}
                </div>

                {/* Back Side */}
                <div
                    className={`absolute flex flex-col items-center justify-center p-8 rounded-3xl border backface-hidden rotate-y-180 h-full w-full ${isAvailable
                            ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30 shadow-2xl shadow-blue-500/20"
                            : "bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 shadow-2xl shadow-orange-500/20"
                        }`}
                >
                    <div className="w-full h-full relative overflow-hidden rounded-2xl flex items-center justify-center">
                        <img
                            src={device.altimg}
                            alt={`${device.name} product`}
                            className="w-full h-full object-contain p-4"
                        />
                    </div>
                    {isAvailable && (
                        <a
                            href="https://shop.cwf-cloud.co.za/category/4"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 w-full py-2.5 border border-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all"
                        >
                            Go to Shop
                        </a>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const ColdChain = () => {
    const devices = [
        {
            name: "Wifi Temperature Sensor",
            image: "/images/icon-temperature@4x-270x300.png",
            altimg: "/images/wifisensor.png",
            description: "High-precision thermal monitoring for sensitive environments.",
            status: "Available"
        },
        {
            name: "Humidity Sensor",
            image: "/images/Humidity@2x-150x150.png",
            altimg: "/images/humiditysensor.png",
            description: "Real-time humidity tracking to prevent moisture damage.",
            status: "Available"
        },
        {
            name: "Air Quality Monitor",
            image: "/images/Air-Quality@2x-150x150.png",
            altimg: "/images/airqualitysensor.png",
            description: "Monitor CO2, VOCs, and particulate matter for safety.",
            status: "Coming Soon"
        },
        {
            name: "Door Sensor",
            image: "/images/icon-door-sensor.png",
            altimg: "/images/doorsensor.png",
            description: "Instant alerts for unauthorized access or open fridge doors.",
            status: "Available"
        },
        {
            name: "Water Leak Detector",
            image: "/images/Water-Moisture@2x-150x150.png",
            altimg: "/images/waterleakdetector.png",
            description: "Detect leaks early to prevent catastrophic infrastructure damage.",
            status: "Available"
        },
        {
            name: "Frequency & Vibration",
            image: "/images/icon-frequency@4x-1-300x252.png",
            altimg: "/images/frequencyvibrationsensor.png",
            description: "Monitor machinery health and structural integrity.",
            status: "Coming Soon"
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
                        <DeviceCard key={i} device={device} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ColdChain;
