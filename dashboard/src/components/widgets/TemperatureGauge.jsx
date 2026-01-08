import React from 'react';
import { motion } from 'framer-motion';

const TemperatureGauge = ({ value, min = 0, max = 100, unit = '°C' }) => {
    // Clamp value between min and max
    const clampedValue = Math.min(Math.max(value, min), max);

    // Calculate percentage (0 to 1)
    const percentage = (clampedValue - min) / (max - min);

    // SVG Properties
    const radius = 80;
    const strokeWidth = 12;
    const center = 100;
    const circumference = Math.PI * radius; // Semi-circle circumference

    // Calculate stroke dash offset
    // The stroke goes from left (0%) to right (100%)
    // circumference is the full length. 
    // We want to hide the part that isn't filled.
    // Full circle = 2 * PI * r. Semi-circle arc length is PI * r.
    const dashOffset = circumference * (1 - percentage);

    // Color interpolation function
    const getColor = (p) => {
        if (p < 0.33) return '#4ade80'; // Green
        if (p < 0.66) return '#facc15'; // Yellow
        return '#f87171'; // Red
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full h-full max-h-[160px]">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                </defs>

                {/* Background Track */}
                <path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Value Track */}
                <motion.path
                    d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>

            {/* Value Text centered at the bottom of the semi-circle */}
            <div className="absolute bottom-4 flex flex-col items-center">
                <motion.span
                    className="text-3xl font-bold text-white font-['Outfit']"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {clampedValue.toFixed(1)}{unit}
                </motion.span>
                <div className="flex justify-between w-32 text-[10px] text-gray-500 font-mono mt-1">
                    <span>{min}{unit}</span>
                    <span>{max}{unit}</span>
                </div>
            </div>
        </div>
    );
};

export default TemperatureGauge;
