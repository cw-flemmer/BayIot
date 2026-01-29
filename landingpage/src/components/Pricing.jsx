import React from 'react';
import { motion } from 'framer-motion';
import { Check, Cpu, Building2 } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: "Single Device",
            icon: Cpu,
            description: "Perfect for small schools, clubs, makers, and individuals",
            other: "You still have to purchase a device, once-off cost. You own it.",
            price: "R399.00",
            period: "/month per device",
            features: [
                "1 connected device",
                "Up to 50 users",
                "Full platform access",
                "Automatic updates",
                "Secure cloud hosting",
                "Email / WhatsApp support",
                "Regular feature improvements"
            ],
            buttonText: "Get Started",
            important: "The monthly fee keeps your system secure, updated, and fully supported",
            highlight: false
        },
        {
            name: "White Label",
            icon: Building2,
            description: "Scale your business with tailored IoT branding.",
            other: "",
            price: "Custom",
            period: "Contact for pricing",
            features: [
                "Everything in Per Device",
                "Custom Logo & Branding",
                "Domain Integration",
                "Advanced Analytics",
                "Priority Support",
                "Unlimited Users"
            ],
            buttonText: "Contact Us",
            important: "The monthly fee keeps your system secure, updated, and fully supported",
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">Pricing</h2>
                    <h3 className="text-4xl font-bold mb-4 text-white">Choose the Right Plan for Your Scale</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Transparent pricing designed to grow with your business. No hidden fees, just pure connectivity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative group h-full"
                        >
                            {/* Animated Border Container */}
                            <div className="absolute -inset-[1px] rounded-[2.2rem] overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,#3b82f6_180deg,transparent_210deg,transparent_360deg)] animate-spin-slow" />
                            </div>

                            {/* Main Card Content */}
                            <div className={`relative h-full p-8 rounded-[2.1rem] bg-black/90 backdrop-blur-xl border border-white/5 transition-all duration-500 group-hover:bg-black/80 flex flex-col`}>
                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500`}>
                                        <plan.icon size={28} />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-2 text-white">{plan.name}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                                    {plan.other && (
                                        <p className="text-yellow-500 text-sm leading-relaxed mt-2">{plan.other}</p>
                                    )}
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-5xl font-bold text-white leading-tight">{plan.price}</span>
                                        <span className="text-gray-500 text-sm font-medium">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                                                <Check size={12} className="text-blue-500" />
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                {plan.important && (
                                    <p className="bg-green-400/10 text-green-700 border border-green-700/10 rounded-lg p-2 text-sm leading-relaxed mt-2">{plan.important}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Pricing;
