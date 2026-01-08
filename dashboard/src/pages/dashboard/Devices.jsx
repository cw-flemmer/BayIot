import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Plus,
    Trash2,
    Loader2,
    X,
    CheckCircle2,
    Search,
    Calendar,
    Activity
} from 'lucide-react';

const Devices = () => {
    const { user } = useAuth();
    const isCustomer = user?.role === 'customer';
    const [devices, setDevices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        device_id: ''
    });

    const fetchDevices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/devices');
            setDevices(response.data);
        } catch (err) {
            console.error('Fetch devices error:', err);
            setError('Failed to load devices.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await api.post('/devices', formData);
            setSuccessMessage('Device registered successfully!');
            setIsModalOpen(false);
            setFormData({ device_id: '' });
            fetchDevices();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create device.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this device?')) return;
        try {
            await api.delete(`/devices/${id}`);
            fetchDevices();
            setSuccessMessage('Device removed.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete device.');
        }
    };

    const filteredDevices = devices.filter(d =>
        d.device_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toString().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Devices</h2>
                    <p className="text-gray-500 mt-1">Manage all Iot hardware linked to your tenant UUID.</p>
                </div>
                {!isCustomer && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20 w-fit"
                    >
                        <Plus size={20} />
                        <span>Add Device</span>
                    </button>
                )}
            </div>

            {/* Search and Feedback */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search devices or customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                    />
                </div>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl flex items-center space-x-2 text-sm"
                    >
                        <CheckCircle2 size={16} />
                        <span>{successMessage}</span>
                    </motion.div>
                )}
            </div>

            {/* Devices Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Device ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Tenant UUID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Created At</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Last Seen</th>
                                {!isCustomer && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                            <p className="text-sm">Loading devices...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDevices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Cpu size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>No devices found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredDevices.map((device) => (
                                    <tr key={device.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="font-bold">{device.device_id}</span>
                                                <span className="text-xs text-gray-500">#{device.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-400 font-mono">{device.tenant_uuid}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                <Calendar size={14} />
                                                <span>{new Date(device.created_at || device.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                <span className="text-gray-300">
                                                    {new Date(device.last_seen || device.updatedAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        {!isCustomer && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(device.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
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
                                <h3 className="text-2xl font-bold">Add New Device</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Device ID</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.device_id}
                                        onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] text-white"
                                        placeholder="e.g. SN-990-221"
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>Register Device</span>}
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

export default Devices;
