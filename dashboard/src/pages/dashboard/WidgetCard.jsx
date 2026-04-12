import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Thermometer, Droplets, Battery, DoorOpen, Bolt, Settings as SettingsIcon, X, Loader2, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api';
import TemperatureGauge from '../../components/widgets/TemperatureGauge';

const WidgetCard = ({ widget, onDelete, onUpdate, isDraggable, showDelete, canManageSettings }) => {
    const { user } = useAuth();
    const isCustomer = user?.role === 'customer';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Widget-specific settings (labels, setpoints)
    const [localSettings, setLocalSettings] = useState(widget.settings || {});

    // Device-level SMS/threshold settings
    const [deviceDbId, setDeviceDbId] = useState(null);
    const [deviceSettings, setDeviceSettings] = useState({
        min_temperature: '',
        max_temperature: '',
        door_open_time_limit: '',
        alert_phone_number: '',
        sms_alerts_enabled: false
    });
    const [deviceLoading, setDeviceLoading] = useState(false);

    // Poll for telemetry every 5 seconds
    useEffect(() => {
        const fetchData = async () => {
            if (!widget.device_id) return;
            try {
                const response = await api.get(`/telemetry/latest/${widget.device_id}`);
                setData(response.data);
            } catch (err) {
                console.error('Widget data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [widget.device_id]);

    // Fetch device settings when modal opens
    const openSettings = async () => {
        setLocalSettings(widget.settings || {});
        setShowSettings(true);

        if (!widget.device_id) return;
        setDeviceLoading(true);
        try {
            const res = await api.get(`/devices/find/${widget.device_id}`);
            setDeviceDbId(res.data.id);
            setDeviceSettings({
                min_temperature: res.data.min_temperature ?? '',
                max_temperature: res.data.max_temperature ?? '',
                door_open_time_limit: res.data.door_open_time_limit ?? '',
                alert_phone_number: res.data.alert_phone_number || '',
                sms_alerts_enabled: res.data.sms_alerts_enabled || false
            });
        } catch (err) {
            console.error('Failed to fetch device settings:', err);
        } finally {
            setDeviceLoading(false);
        }
    };

    const getIcon = () => {
        switch (widget.type) {
            case 'temperature': return <Thermometer className="text-orange-400" size={24} />;
            case 'humidity': return <Droplets className="text-blue-400" size={24} />;
            case 'battery': return <Battery className="text-green-400" size={24} />;
            case 'door': return <DoorOpen className="text-purple-400" size={24} />;
            default: return <Bolt className="text-gray-400" size={24} />;
        }
    };

    const getValue = () => {
        if (loading) return '...';
        if (!data) return '--';

        switch (widget.type) {
            case 'temperature':
                return <TemperatureGauge
                    value={data.temperature || 0}
                    min={localSettings?.min !== undefined ? Number(localSettings.min) : 0}
                    max={localSettings?.max !== undefined ? Number(localSettings.max) : 100}
                />;
            case 'humidity': return `${data.humidity?.toFixed(1) || '--'}%`;
            case 'battery': return `${data.battery_level || '--'}%`;
            case 'door':
                const closedLabel = localSettings?.closedLabel || 'CLOSED';
                const openLabel = localSettings?.openLabel || 'OPEN';
                return data.door_status ? closedLabel : openLabel;
            default: return '--';
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 1. Save widget-level settings (labels, setpoints)
            if (onUpdate) {
                await onUpdate(widget.id, { settings: localSettings });
            }

            // 2. Save device-level SMS/threshold settings
            if (deviceDbId) {
                const payload = {
                    min_temperature: deviceSettings.min_temperature !== '' ? Number(deviceSettings.min_temperature) : null,
                    max_temperature: deviceSettings.max_temperature !== '' ? Number(deviceSettings.max_temperature) : null,
                    door_open_time_limit: deviceSettings.door_open_time_limit !== '' ? Number(deviceSettings.door_open_time_limit) : null,
                    alert_phone_number: deviceSettings.alert_phone_number,
                    sms_alerts_enabled: deviceSettings.sms_alerts_enabled
                };
                await api.put(`/devices/${deviceDbId}`, payload);
            }

            setShowSettings(false);
        } catch (err) {
            console.error('Failed to save widget settings:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`h-full w-full bg-[#020617]/80 backdrop-blur-xl border border-orange-400 rounded-3xl p-5 flex flex-col items-center relative group overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:border-orange-300 ${isDraggable ? 'cursor-move drag-handle' : ''}`}>
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-white/5">
                        {getIcon()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-200 text-left">{widget.title || widget.type}</h4>
                        <p className="text-[10px] text-gray-500 font-mono tracking-wider text-left">{widget.device_id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    {canManageSettings && (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={openSettings}
                            className="text-gray-600 hover:text-blue-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Widget Settings"
                        >
                            <SettingsIcon size={16} />
                        </button>
                    )}
                    {showDelete && (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => onDelete(widget.id)}
                            className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Widget"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Value */}
            <div className="flex-1 flex items-center justify-center w-full">
                {widget.type === 'temperature' ? (
                    getValue()
                ) : (
                    <span className={`text-4xl font-bold font-['Outfit'] ${widget.type === 'door' ? (data?.door_status ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                        {getValue()}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="w-full mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                <span className="truncate pr-2">
                    {data?.created_at ? new Date(data.created_at).toLocaleString() : 'Waiting for data...'}
                </span>
                {widget.type === 'battery' && (
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${data?.battery_level || 0}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Subtle background gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Settings Modal — rendered via portal into document.body */}
            {showSettings && ReactDOM.createPortal(
                <AnimatePresence>
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSettings(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-3xl p-8 relative z-10 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold">Widget Settings</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Configuring <span className="text-blue-400 font-bold">{widget.title || widget.type}</span>
                                        {widget.device_id && <> · <span className="font-mono text-gray-400">{widget.device_id}</span></>}
                                    </p>
                                </div>
                                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveSettings} className="space-y-8">

                                {/* ── Widget Display Settings ── */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Display Settings</h4>

                                    {widget.type === 'temperature' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Min. Setpoint</label>
                                                <input
                                                    type="number"
                                                    value={localSettings.min || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, min: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white text-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Max. Setpoint</label>
                                                <input
                                                    type="number"
                                                    value={localSettings.max || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, max: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white text-sm"
                                                    placeholder="100"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {widget.type === 'door' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Open Label</label>
                                                <input
                                                    type="text"
                                                    value={localSettings.openLabel || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, openLabel: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white text-sm"
                                                    placeholder="OPEN"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Closed Label</label>
                                                <input
                                                    type="text"
                                                    value={localSettings.closedLabel || ''}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, closedLabel: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white text-sm"
                                                    placeholder="CLOSED"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {!['temperature', 'door'].includes(widget.type) && (
                                        <p className="text-sm text-gray-500 italic">No display settings for this widget type.</p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/10" />

                                {/* ── SMS Alert Settings ── */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Bell size={14} className="text-purple-400" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">SMS Alert Settings</h4>
                                    </div>

                                    {deviceLoading ? (
                                        <div className="flex items-center space-x-2 text-gray-500 py-4">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span className="text-sm">Loading device config...</span>
                                        </div>
                                    ) : !deviceDbId ? (
                                        <p className="text-sm text-gray-500 italic">No linked device found for alert configuration.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* SMS Enable Toggle */}
                                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                                                <div>
                                                    <h5 className="font-bold text-gray-200 text-sm">Enable SMS Alerts</h5>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Send SMS when thresholds are breached
                                                        {isCustomer && <span className="text-gray-400 italic ml-1">(Admin Only)</span>}
                                                    </p>
                                                </div>
                                                <label className={`relative inline-flex items-center ${isCustomer ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={deviceSettings.sms_alerts_enabled}
                                                        onChange={(e) => setDeviceSettings({ ...deviceSettings, sms_alerts_enabled: e.target.checked })}
                                                        disabled={isCustomer}
                                                    />
                                                    <div className={`w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isCustomer ? '' : 'peer-checked:bg-purple-500'}`}></div>
                                                </label>
                                            </div>

                                            {/* Phone Number */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Alert Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={deviceSettings.alert_phone_number}
                                                    onChange={(e) => setDeviceSettings({ ...deviceSettings, alert_phone_number: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white text-sm"
                                                    placeholder="+27821234567"
                                                />
                                            </div>

                                            {/* Temperature thresholds */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300 ml-1">Min Temp (°C)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={deviceSettings.min_temperature}
                                                        onChange={(e) => setDeviceSettings({ ...deviceSettings, min_temperature: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white text-sm"
                                                        placeholder="No limit"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300 ml-1">Max Temp (°C)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={deviceSettings.max_temperature}
                                                        onChange={(e) => setDeviceSettings({ ...deviceSettings, max_temperature: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white text-sm"
                                                        placeholder="No limit"
                                                    />
                                                </div>
                                            </div>

                                            {/* Door Open Time Limit */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Door Open Time Limit (sec)</label>
                                                <input
                                                    type="number"
                                                    value={deviceSettings.door_open_time_limit}
                                                    onChange={(e) => setDeviceSettings({ ...deviceSettings, door_open_time_limit: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white text-sm"
                                                    placeholder="e.g. 60"
                                                />
                                                <p className="text-xs text-gray-500 ml-1">Alert if door remains open longer than this duration.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSettings(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-2xl font-bold transition-all text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <span>Save Settings</span>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default WidgetCard;
