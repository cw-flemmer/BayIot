import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DeviceCard = ({ device, index, onImageClick }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const isAvailable = device.status === 'Available';

    return (
        <div
            className="relative h-[480px] w-full perspective-1000 cursor-pointer group"
            onClick={handleFlip}
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            <motion.div
                className="relative w-full h-full preserve-3d will-change-transform"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Front Side */}
                <div
                    className={`absolute flex flex-col items-center justify-between p-8 rounded-3xl border backface-hidden h-full w-full shadow-lg ${isAvailable
                        ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30 group-hover:border-blue-500/50"
                        : "bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 group-hover:border-orange-500/50"
                        }`}
                    style={{ transform: 'translateZ(1px)' }}
                >
                    {/* Status Tag */}
                    <div className={`absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-20 ${isAvailable
                        ? "bg-blue-500 text-white shadow-blue-500/20"
                        : "bg-orange-500 text-white border border-white/10"
                        }`}>
                        {device.status}
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center justify-center">
                        <div
                            className="w-32 h-32 mx-auto mb-6 relative flex items-center justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageClick(device.image);
                            }}
                        >
                            <div className={`absolute inset-0 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isAvailable ? "bg-blue-500/20" : "bg-orange-500/20"
                                }`} />
                            <img
                                src={device.image}
                                alt={device.name}
                                className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110"
                            />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-white">{device.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 px-4">{device.description}</p>
                    </div>

                    {isAvailable && (
                        <a
                            href="https://shop.cwf-cloud.co.za/category/4"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-3 border border-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 z-10 text-center"
                        >
                            Buy Now
                        </a>
                    )}
                </div>

                {/* Back Side */}
                <div
                    className={`absolute flex flex-col items-center justify-center p-8 rounded-3xl border backface-hidden rotate-y-180 h-full w-full shadow-2xl ${isAvailable
                        ? "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-[#020617] border-blue-500/30"
                        : "bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-[#020617] border-orange-500/30"
                        }`}
                    style={{ transform: 'rotateY(180deg) translateZ(1px)' }}
                >
                    <div
                        className="w-full h-full relative overflow-hidden rounded-2xl flex items-center justify-center p-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            onImageClick(device.altimg);
                        }}
                    >
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
                            className="mt-4 w-full py-3 border border-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all text-center"
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
    const [selectedImage, setSelectedImage] = useState(null);

    const devices = [
        {
            name: "Wifi Temperature Sensor",
            image: "/images/icon-temperature@4x-270x300.png",
            altimg: "/images/wifisensor.png",
            description: "High-precision thermal monitoring for sensitive environments.",
            status: "Available",
            show: true
        },
        {
            name: "Humidity Sensor",
            image: "/images/Humidity@2x-150x150.png",
            altimg: "/images/humiditysensor.png",
            description: "Real-time humidity tracking to prevent moisture damage.",
            status: "Available",
            show: true
        },
        {
            name: "Door Sensor",
            image: "/images/icon-door-sensor.png",
            altimg: "/images/doorsensor.png",
            description: "Instant alerts for unauthorized access or open fridge doors.",
            status: "Available",
            show: true
        },
        {
            name: "Air Quality Monitor",
            image: "/images/Air-Quality@2x-150x150.png",
            altimg: "/images/airqualitysensor.png",
            description: "Monitor CO2, VOCs, and particulate matter for safety.",
            status: "Coming Soon",
            show: true
        },
        {
            name: "Water Leak Detector",
            image: "/images/Water-Moisture@2x-150x150.png",
            altimg: "/images/waterleakdetector.png",
            description: "Detect leaks early to prevent catastrophic infrastructure damage.",
            status: "Available",
            show: false
        },
        {
            name: "Frequency & Vibration",
            image: "/images/icon-frequency@4x-1-300x252.png",
            altimg: "/images/frequencyvibrationsensor.png",
            description: "Monitor machinery health and structural integrity.",
            status: "Coming Soon",
            show: false
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
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                        Our specialized sensors provide unparalleled visibility into your most critical assets and environments.
                    </p>

                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-medium tracking-wide"
                    >
                        (Click to view sensor)
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {devices
                        .filter(device => device.show)
                        .map((device, i) => (
                            <DeviceCard
                                key={i}
                                device={device}
                                index={i}
                                onImageClick={(img) => setSelectedImage(img)}
                            />
                        ))}
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl h-full flex items-center justify-center pointer-events-none"
                        >
                            <img
                                src={selectedImage}
                                alt="Product Preview"
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl pointer-events-auto"
                            />

                            <button
                                onClick={() => setSelectedImage(null)}
                                className="fixed top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-[110] pointer-events-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ColdChain;
