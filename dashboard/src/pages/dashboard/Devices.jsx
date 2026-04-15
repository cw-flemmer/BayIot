import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Plus,
    Trash2,
    Edit3,
    Loader2,
    X,
    CheckCircle2,
    Search,
    Calendar,
    Layout,
    Settings
} from 'lucide-react';

const Devices = () => {
    const { user } = useAuth();
    const isCustomer = user?.role === 'customer';
    const [devices, setDevices] = useState([]);
    const [dashboards, setDashboards] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        device_id: ''
    });

    const [allocateData, setAllocateData] = useState({
        dashboard_id: ''
    });

    const [settingsData, setSettingsData] = useState({
        min_temperature: '',
        max_temperature: '',
        door_open_time_limit: '',
        alert_phone_number: '',
        sms_alerts_enabled: false,
        tenant_customer_id: ''
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

    const fetchDashboards = async () => {
        try {
            const response = await api.get('/dashboards');
            setDashboards(response.data);
        } catch (err) {
            console.error('Fetch dashboards error:', err);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (err) {
            console.error('Fetch customers error:', err);
        }
    };

    useEffect(() => {
        fetchDevices();
        if (!isCustomer) {
            fetchDashboards();
            fetchCustomers();
        }
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

    const handleAllocate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await api.post(`/devices/${selectedDevice.id}/allocate`, allocateData);
            setSuccessMessage('Device allocated successfully!');
            setIsAllocateModalOpen(false);
            setAllocateData({ dashboard_id: '' });
            fetchDevices();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to allocate device.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const dataToSubmit = {
                ...settingsData,
                min_temperature: settingsData.min_temperature !== '' ? Number(settingsData.min_temperature) : null,
                max_temperature: settingsData.max_temperature !== '' ? Number(settingsData.max_temperature) : null,
                door_open_time_limit: settingsData.door_open_time_limit !== '' ? Number(settingsData.door_open_time_limit) : null,
            };
            await api.put(`/devices/${selectedDevice.id}`, dataToSubmit);
            setSuccessMessage('Device settings updated successfully!');
            setIsSettingsModalOpen(false);
            fetchDevices();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update device settings.');
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

    const openAllocateModal = (device) => {
        setSelectedDevice(device);
        setAllocateData({ dashboard_id: device.dashboard_id || '' });
        setIsAllocateModalOpen(true);
        setError('');
    };

    const openSettingsModal = (device) => {
        setSelectedDevice(device);
        setSettingsData({
            min_temperature: device.min_temperature ?? '',
            max_temperature: device.max_temperature ?? '',
            door_open_time_limit: device.door_open_time_limit ?? '',
            alert_phone_number: device.alert_phone_number || '',
            sms_alerts_enabled: device.sms_alerts_enabled || false,
            tenant_customer_id: device.tenant_customer_id || ''
        });
        setIsSettingsModalOpen(true);
        setError('');
    };

    const filteredDevices = devices.filter(d =>
        d.device_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toString().includes(searchQuery.toLowerCase()) ||
        d.allocatedDashboard?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
                        placeholder="Search devices, IDs, or dashboards..."
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
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Dashboard / Customer</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Created At</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Last Seen</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
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
                                            <div className="flex flex-col gap-2">
                                                {device.allocatedDashboard ? (
                                                    <div className="flex items-center space-x-2 text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full w-fit">
                                                        <Layout size={14} />
                                                        <span className="text-xs font-bold">{device.allocatedDashboard.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">Unallocated Dash</span>
                                                )}
                                                {device.customer ? (
                                                    <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full w-fit">
                                                        <Cpu size={14} />
                                                        <span className="text-xs font-bold">{device.customer.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">No Customer</span>
                                                )}
                                            </div>
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => openSettingsModal(device)}
                                                        className="p-2 text-gray-500 hover:text-purple-400 transition-colors"
                                                        title="Configure SMS Thresholds"
                                                    >
                                                        <Settings size={18} />
                                                    </button>
                                                    {!isCustomer && (
                                                        <>
                                                            <button
                                                                onClick={() => openAllocateModal(device)}
                                                                className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                                                                title="Allocate to Dashboard"
                                                            >
                                                                <Layout size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(device.id)}
                                                                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                                title="Delete Device"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
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

            {/* Allocate Modal */}
            <AnimatePresence>
                {isAllocateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAllocateModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl text-white"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold">Allocate Device</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Assigning <span className="text-blue-400 font-bold">{selectedDevice?.device_id}</span>
                                    </p>
                                </div>
                                <button onClick={() => setIsAllocateModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAllocate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Target Dashboard</label>
                                    <select
                                        required
                                        value={allocateData.dashboard_id}
                                        onChange={(e) => setAllocateData({ ...allocateData, dashboard_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] text-white"
                                    >
                                        <option value="" className="bg-[#0f172a]">Select a dashboard</option>
                                        {dashboards.map((dash) => (
                                            <option key={dash.id} value={dash.id} className="bg-[#0f172a]">
                                                {dash.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAllocateModalOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>Confirm Allocation</span>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-3xl p-8 relative z-10 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold">Device Settings</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Configure alerts for <span className="text-purple-400 font-bold">{selectedDevice?.device_id}</span>
                                    </p>
                                </div>
                                <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSaveSettings} className="space-y-6">
                                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div>
                                        <h4 className="font-bold text-gray-200">Enable SMS Alerts</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            Send SMS when thresholds are breached
                                            {isCustomer && <span className="text-gray-400 italic">(Admin Only)</span>}
                                        </p>
                                    </div>
                                    <label className={`relative inline-flex items-center ${isCustomer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settingsData.sms_alerts_enabled}
                                            onChange={(e) => setSettingsData({ ...settingsData, sms_alerts_enabled: e.target.checked })}
                                            disabled={isCustomer}
                                        />
                                        <div className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isCustomer ? '' : 'peer-checked:bg-purple-500'}`}></div>
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Alert Phone Number</label>
                                    <input
                                        type="text"
                                        value={settingsData.alert_phone_number}
                                        onChange={(e) => setSettingsData({ ...settingsData, alert_phone_number: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-['Outfit'] text-white"
                                        placeholder="+27821234567"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Min Temp (°C)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                                    value={settingsData.min_temperature}
                                                    onChange={(e) => setSettingsData({ ...settingsData, min_temperature: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-['Outfit'] text-white"
                                                    placeholder="No limit"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Max Temp (°C)</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={settingsData.max_temperature}
                                                    onChange={(e) => setSettingsData({ ...settingsData, max_temperature: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-['Outfit'] text-white"
                                                    placeholder="No limit"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Door Open Time Limit (sec)</label>
                                            <input
                                                type="number"
                                                value={settingsData.door_open_time_limit}
                                                onChange={(e) => setSettingsData({ ...settingsData, door_open_time_limit: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-['Outfit'] text-white"
                                                placeholder="e.g. 60"
                                            />
                                    <p className="text-xs text-gray-500 ml-1 mt-1">Alert if door stays open longer than this duration.</p>
                                </div>

                                {!isCustomer && (
                                    <div className="space-y-2 border-t border-white/10 pt-4 mt-4">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Assigned Customer (SMS Billing)</label>
                                        <select
                                            value={settingsData.tenant_customer_id}
                                            onChange={(e) => setSettingsData({ ...settingsData, tenant_customer_id: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-['Outfit'] text-white"
                                        >
                                            <option value="" className="bg-[#0f172a]">Unassigned (No billing)</option>
                                            {customers.map((c) => (
                                                <option key={c.id} value={c.id} className="bg-[#0f172a]">
                                                    {c.name} ({c.email})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 ml-1 m-1">Link device to a customer to use their shared SMS credit pool.</p>
                                    </div>
                                )}

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsSettingsModalOpen(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>Save Settings</span>}
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
