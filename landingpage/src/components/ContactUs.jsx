import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Ready to take your IoT strategy to the next level? Our team is here to help you
                        every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {[
                        { icon: Mail, label: "Email Us", info: "contact@bayiot.com" },
                        { icon: Phone, label: "Call Us", info: "+27 (0) 12 345 6789" },
                        { icon: MapPin, label: "Visit Us", info: "Cape Town, South Africa" }
                    ].map((contact, i) => (
                        <div key={i} className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500">
                                <contact.icon className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{contact.label}</p>
                            <p className="font-bold text-gray-200">{contact.info}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
