import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    ShieldAlert,
    Lock,
    Mail,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const SiteAdminLogin = () => {
    const { siteAdminLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await siteAdminLogin(email, password);
            navigate('/dashboard/tenants');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to login as site admin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-500 hover:text-white flex items-center space-x-2 transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </button>
                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-widest">
                        Restricted Access
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 bg-gradient-to-tr from-red-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white">
                            <ShieldAlert size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Platform Administration</h1>
                        <p className="text-gray-500 text-sm mt-2">Enter your secure credentials to manage tenants.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Admin Email"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Secure Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span>Authenticate Administrator</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
                    System Access Logged • Session Encrypted
                </p>
            </motion.div>
        </div>
    );
};

export default SiteAdminLogin;
