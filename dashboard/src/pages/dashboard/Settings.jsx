import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext.jsx';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    Upload,
    Palette,
    Users,
    ShieldCheck,
    Save,
    Loader2,
    CheckCircle2
} from 'lucide-react';

const Settings = () => {
    const { tenantInfo, refreshTenantInfo } = useTenant();
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith('http')) return logoPath;
        if (logoPath.startsWith('/')) return logoPath;
        return `/images/${logoPath}`;
    };

    // General Form State
    const [name, setName] = useState(tenantInfo?.name || '');
    const [theme, setTheme] = useState(tenantInfo?.theme || 'dark');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveGeneral = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('theme', theme);
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            await api.put('/tenant/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await refreshTenantInfo();
            setSuccessMessage('Settings updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings.');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Palette },
        { id: 'access', label: 'Customers & Access', icon: Users },
    ];

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold">Settings</h2>
                <p className="text-gray-500 mt-1">Manage your platform identity and user access.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
                {activeTab === 'general' ? (
                    <form onSubmit={handleSaveGeneral} className="space-y-8">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-sm flex items-center space-x-2">
                                <CheckCircle2 size={18} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Logo Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-300">Platform Logo</label>
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {logoPreview || tenantInfo?.logo ? (
                                            <img src={logoPreview || getLogoUrl(tenantInfo.logo)} alt="Preview" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <ShieldCheck size={40} className="text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors shadow-lg shadow-blue-600/20">
                                            <Upload size={16} />
                                            <span>Upload New Logo</span>
                                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Recommended: SVG or Transparent PNG. Max 2MB.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Platform Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="Enter platform name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Default Theme</label>
                                    <select
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                    >
                                        <option value="dark" className="bg-[#0f172a]">Midnight Dark</option>
                                        <option value="light" className="bg-[#0f172a]">Clean Light</option>
                                        <option value="glass" className="bg-[#0f172a]">Modern Glass (Active)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Manage Customers</h3>
                            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                + Add Customer
                            </button>
                        </div>
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center text-gray-500">
                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium">User management list will appear here.</p>
                            <p className="text-sm">You can currently view users in the "Users" sidebar tab.</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Settings;
