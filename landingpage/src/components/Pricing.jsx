import React from 'react';
import { motion } from 'framer-motion';
import { Check, Cpu, Building2 } from 'lucide-react';

const Pricing = () => {
    const plans = [
        {
            name: "Per Device",
            icon: Cpu,
            description: "Ideal for small to medium sensor networks.",
            price: "R50",
            period: "/device/month",
            features: [
                "Real-time monitoring",
                "Standard Dashboard Data",
                "Email Notifications",
                "Secure Connectivity",
                "API Access"
            ],
            buttonText: "Get Started",
            highlight: false
        },
        {
            name: "White Label",
            icon: Building2,
            description: "Scale your business with tailored IoT branding.",
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
            highlight: true
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">Pricing</h2>
                    <h3 className="text-4xl font-bold mb-4 text-white">Choose the Right Plan for Your Scale</h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Transparent pricing designed to grow with your business. No hidden fees, just pure connectivity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${plan.highlight
                                    ? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10"
                                    : "bg-white/[0.02] border-white/5 hover:border-white/20"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                    Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-500"
                                    }`}>
                                    <plan.icon size={28} />
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-white">{plan.name}</h4>
                                <p className="text-gray-400 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500 text-sm font-medium">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center text-gray-300">
                                        <Check size={18} className="text-blue-500 mr-3 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-2xl font-bold transition-all cursor-pointer ${plan.highlight
                                        ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
