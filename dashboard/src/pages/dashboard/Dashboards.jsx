import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Plus,
    Trash2,
    Edit3,
    Loader2,
    X,
    CheckCircle2
} from 'lucide-react';

const Dashboards = () => {
    const [dashboards, setDashboards] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        customer_id: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [dashboardsRes, customersRes] = await Promise.all([
                api.get('/dashboards'),
                api.get('/customers')
            ]);
            setDashboards(dashboardsRes.data);
            setCustomers(customersRes.data);
        } catch (err) {
            console.error('Fetch dashboards error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to load data.';
            setError(`Error: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await api.post('/dashboards', formData);
            setSuccessMessage('Dashboard created successfully!');
            setIsModalOpen(false);
            setFormData({ name: '', description: '', customer_id: '' });
            fetchData();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create dashboard.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dashboard?')) return;
        try {
            await api.delete(`/dashboards/${id}`);
            fetchData();
            setSuccessMessage('Dashboard deleted.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to delete.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Dashboards</h2>
                    <p className="text-gray-500 mt-1">Manage and assign interactive dashboards to your customers.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    <span>New Dashboard</span>
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

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : dashboards.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-white">
                    <Layout size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-gray-400">No dashboards created yet.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-400 hover:text-blue-300 font-semibold mt-2"
                    >
                        Create your first dashboard
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboards.map((db) => (
                        <motion.div
                            key={db.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400">
                                    <Layout size={24} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(db.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{db.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">{db.description || 'No description provided.'}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                        {db.assignedCustomer?.name?.[0] || '?'}
                                    </div>
                                    <div className="text-xs">
                                        <p className="text-gray-400">Assigned to</p>
                                        <p className="font-semibold text-white">{db.assignedCustomer?.name || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">Status</p>
                                    <p className="text-xs text-green-400 font-bold">Active</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

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
                                <h3 className="text-2xl font-bold">New Dashboard</h3>
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
                                    <label className="text-sm font-medium text-gray-300 ml-1">Dashboard Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] text-white"
                                        placeholder="e.g. Smart Office Monitoring"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] h-24 resize-none text-white"
                                        placeholder="Details about this dashboard..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Assign to Customer</label>
                                    <select
                                        value={formData.customer_id}
                                        onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] appearance-none text-white"
                                    >
                                        <option value="" className="bg-[#0f172a]">Select a customer (Optional)</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id} className="bg-[#0f172a]">{c.name} ({c.email})</option>
                                        ))}
                                    </select>
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
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>Create Dashboard</span>}
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

export default Dashboards;
