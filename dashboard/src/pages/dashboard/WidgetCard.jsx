import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Move, Thermometer, Droplets, Battery, DoorOpen, Bolt, Settings as SettingsIcon, X } from 'lucide-react';
import api from '../../services/api';
import TemperatureGauge from '../../components/widgets/TemperatureGauge';

const WidgetCard = ({ widget, onDelete, onUpdate, isDraggable, showDelete, canManageSettings }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [localSettings, setLocalSettings] = useState(widget.settings || {});

    // Poll for data every 5 seconds
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
                            min={widget.settings?.min !== undefined ? Number(widget.settings.min) : 0} 
                            max={widget.settings?.max !== undefined ? Number(widget.settings.max) : 100} 
                        />;
            case 'humidity': return `${data.humidity?.toFixed(1) || '--'}%`;
            case 'battery': return `${data.battery_level || '--'}%`;
            case 'door': 
                const closedLabel = widget.settings?.closedLabel || 'CLOSED';
                const openLabel = widget.settings?.openLabel || 'OPEN';
                return data.door_status ? closedLabel : openLabel;
            default: return '--';
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        if (onUpdate) {
            await onUpdate(widget.id, { settings: localSettings });
        }
        setShowSettings(false);
    };

    return (
        <div className={`h-full w-full bg-[#020617]/80 backdrop-blur-xl border border-orange-400 rounded-3xl p-5 flex flex-col items-center relative group overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:border-orange-300 ${isDraggable ? 'cursor-move drag-handle' : ''}`}>
            {/* Header */}
            <div className="w-full flex items-center justify-center mb-4">
                <div className="flex items-center justify-center space-x-3">
                    <div className="p-2 rounded-xl bg-white/5">
                        {getIcon()}
                    </div>
                    <div className=''>
                        <h4 className="font-bold text-sm text-gray-200 text-left">{widget.title || widget.type}</h4>
                        <p className="text-[10px] text-gray-500 font-mono tracking-wider text-left">{widget.device_id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {canManageSettings && (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => setShowSettings(true)}
                            className="text-gray-600 hover:text-blue-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <SettingsIcon size={16} />
                        </button>
                    )}
                    {showDelete && (
                        <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => onDelete(widget.id)}
                            className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <span className={`text-4xl font-bold font-['Outfit'] ${widget.type === 'door' ? (data?.door_status ? 'text-red-400' : 'text-green-400') : 'text-white'}`}>
                        {getValue()}
                    </span>
                )}
            </div>

            {/* Footer / Status */}
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

            {/* Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Settings Overlay */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onMouseDown={(e) => e.stopPropagation()} 
                         className="absolute inset-0 bg-[#0f172a] z-20 flex flex-col p-5"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm text-gray-200">Widget Settings</h4>
                            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSettings} className="flex-1 flex flex-col space-y-3 overflow-y-auto custom-scrollbar">
                            {widget.type === 'temperature' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Min. Setpoint</label>
                                        <input
                                            type="number"
                                            value={localSettings.min || ''}
                                            onChange={(e) => setLocalSettings({...localSettings, min: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Max. Setpoint</label>
                                        <input
                                            type="number"
                                            value={localSettings.max || ''}
                                            onChange={(e) => setLocalSettings({...localSettings, max: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="100"
                                        />
                                    </div>
                                </>
                            )}
                            
                            {widget.type === 'door' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Open Label</label>
                                        <input
                                            type="text"
                                            value={localSettings.openLabel || ''}
                                            onChange={(e) => setLocalSettings({...localSettings, openLabel: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="OPEN"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">Closed Label</label>
                                        <input
                                            type="text"
                                            value={localSettings.closedLabel || ''}
                                            onChange={(e) => setLocalSettings({...localSettings, closedLabel: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                                            placeholder="CLOSED"
                                        />
                                    </div>
                                </>
                            )}
                            
                            {(!['temperature', 'door'].includes(widget.type)) && (
                                <p className="text-xs text-gray-500 mt-2">No specific settings for this widget type yet.</p>
                            )}

                            <button 
                                type="submit"
                                className="mt-auto w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-bold text-white transition-colors"
                            >
                                Save Settings
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WidgetCard;
