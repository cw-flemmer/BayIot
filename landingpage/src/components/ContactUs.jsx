import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-white/[0.01]">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-blue-500 uppercase tracking-widest text-sm text-left">Contact Us</h2>
                        <h2 className="text-4xl font-bold mb-6 text-white text-left">Let's Build the Future Together</h2>
                        <p className="text-lg text-gray-400 mb-12 leading-relaxed text-left">
                            Have questions about our hardware or white label solutions? We are ready to assist you.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Email", value: "sales@cwf-electronics.co.za", desc: "Drop us a line anytime" },
                                { icon: Phone, label: "Whatsapp", value: "0751204552", desc: "Mon-Fri from 8am to 5pm" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mr-6 group-hover:scale-110 transition-transform flex-shrink-0">
                                        <item.icon size={22} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                        <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{item.value}</p>
                                        <p className="text-sm text-gray-500/80">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ContactUs;
