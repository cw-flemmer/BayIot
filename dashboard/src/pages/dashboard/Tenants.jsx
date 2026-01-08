import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building,
    Plus,
    Search as SearchIcon,
    Edit2,
    Trash2,
    Loader2,
    X,
    CheckCircle2,
    Globe,
    Palette
} from 'lucide-react';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        theme: 'dark'
    });

    const fetchTenants = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/super/tenants');
            setTenants(response.data);
        } catch (err) {
            console.error('Fetch tenants error:', err);
            setError('Failed to load tenants data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const handleOpenModal = (tenant = null) => {
        if (tenant) {
            setEditingTenant(tenant);
            setFormData({
                name: tenant.name,
                domain: tenant.domain,
                theme: tenant.theme || 'dark'
            });
        } else {
            setEditingTenant(null);
            setFormData({ name: '', domain: '', theme: 'dark' });
        }
        setIsModalOpen(true);
        setError('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            if (editingTenant) {
                await api.put(`/super/tenants/${editingTenant.id}`, formData);
                setSuccessMessage('Tenant updated successfully!');
            } else {
                await api.post('/super/tenants', formData);
                setSuccessMessage('Tenant created successfully!');
            }
            setIsModalOpen(false);
            fetchTenants();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save tenant.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tenant? This action is IRREVERSIBLE.')) return;
        try {
            await api.delete(`/super/tenants/${id}`);
            fetchTenants();
            setSuccessMessage('Tenant deleted.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete.');
        }
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Tenants Management</h2>
                    <p className="text-gray-500 mt-1">Global administration for all platform tenants.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    <span>Add New Tenant</span>
                </button>
            </div>

            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex items-center space-x-2"
                >
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </motion.div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="relative max-w-md w-full">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search tenants by name or domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Tenant Info</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">UUID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Domain</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Created At</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400">Default Theme</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-16 bg-white/[0.01]" />
                                    </tr>
                                ))
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No tenants found matching your search.
                                    </td>
                                </tr>
                            ) : filteredTenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                                                <Building size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold">{tenant.name}</p>
                                                <p className="text-xs text-gray-500">ID: {tenant.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-[11px] text-blue-400/70 font-mono bg-blue-400/5 px-2 py-1 rounded-md w-fit">
                                            <span>{tenant.uuid}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                                            <Globe size={14} className="text-gray-500" />
                                            <span>{tenant.domain}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {new Date(tenant.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                            {tenant.theme || 'light'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(tenant)}
                                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tenant.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl text-white"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold">{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Tenant Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                {editingTenant && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 ml-1 uppercase tracking-wider text-[10px]">Tenant UUID (Read Only)</label>
                                        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 px-4 text-gray-500 font-mono text-xs select-all">
                                            {editingTenant.uuid}
                                        </div>
                                        <p className="text-[10px] text-gray-600 ml-1 italic">Used for linking external devices.</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Domain / Hostname</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase() })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                                            placeholder="e.g. acme.bayiot.com"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 ml-1">The application uses this domain to identify the tenant.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Default Theme</label>
                                    <div className="relative">
                                        <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <select
                                            value={formData.theme}
                                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none text-white"
                                        >
                                            <option value="dark" className="bg-[#0f172a]">Dark Mode</option>
                                            <option value="light" className="bg-[#0f172a]">Light Mode</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>{editingTenant ? 'Update Tenant' : 'Create Tenant'}</span>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tenants;
