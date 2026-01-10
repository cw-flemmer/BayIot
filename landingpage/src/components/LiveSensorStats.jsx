import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Activity, Clock, ShieldCheck, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, color, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} transition-transform group-hover:scale-110`}>
                <Icon size={24} />
            </div>
            <div className="flex items-baseline space-x-1 mb-1">
                <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
                <span className="text-gray-500 text-sm font-medium">{unit}</span>
            </div>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
        </motion.div>
    );
};

const LiveSensorStats = () => {
    const [stats, setStats] = useState({
        sensors: 1240,
        temp: 22.4,
        uptime: 99.98,
        dataPoints: 24500
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                sensors: prev.sensors + (Math.random() > 0.5 ? 1 : 0),
                temp: +(22 + Math.random()).toFixed(1),
                uptime: 99.98,
                dataPoints: prev.dataPoints + Math.floor(Math.random() * 10)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 border-y border-white/5 bg-[#020617]/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <StatCard
                        icon={Activity}
                        label="Active Sensors"
                        value={stats.sensors.toLocaleString()}
                        unit=""
                        color="bg-orange-500/10 text-orange-400"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Zap}
                        label="Avg. Temp"
                        value={stats.temp}
                        unit="°C"
                        color="bg-blue-500/10 text-blue-400"
                        delay={0.2}
                    />
                    <StatCard
                        icon={ShieldCheck}
                        label="System Uptime"
                        value={stats.uptime}
                        unit="%"
                        color="bg-green-500/10 text-green-400"
                        delay={0.3}
                    />
                    <StatCard
                        icon={Clock}
                        label="Data / Hr"
                        value={(stats.dataPoints / 1000).toFixed(1)}
                        unit="k"
                        color="bg-purple-500/10 text-purple-400"
                        delay={0.4}
                    />
                </div>

                {/* Live Heartbeat Indicator */}
                <div className="mt-8 flex items-center justify-center space-x-3">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        Live Network Feed Active
                    </span>
                </div>
            </div>
        </section>
    );
};

export default LiveSensorStats;
