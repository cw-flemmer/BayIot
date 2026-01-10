import React from 'react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-gray-500">
                <p>© 2026 BayIoT. All rights reserved.</p>
                <div className="flex space-x-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
