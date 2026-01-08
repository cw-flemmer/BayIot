import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Move, Thermometer, Droplets, Battery, DoorOpen, Bolt } from 'lucide-react';
import api from '../../services/api';
import TemperatureGauge from '../../components/widgets/TemperatureGauge';

const WidgetCard = ({ widget, onDelete, isDraggable, showDelete }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            case 'temperature': return `${data.temperature?.toFixed(1) || '--'}°C`;
            case 'humidity': return `${data.humidity?.toFixed(1) || '--'}%`;
            case 'battery': return `${data.battery_level || '--'}%`;
            case 'door': return data.door_status ? 'OPEN' : 'CLOSED';
            default: return '--';
        }
    };

    return (
        <div className={`h-full w-full bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col relative group overflow-hidden shadow-xl ${isDraggable ? 'cursor-move drag-handle' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-white/5">
                        {getIcon()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-200">{widget.title || widget.type}</h4>
                        <p className="text-[10px] text-gray-500 font-mono tracking-wider">{widget.device_id}</p>
                    </div>
                </div>
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

            {/* Value */}
            <div className="flex-1 flex items-center justify-center w-full">
                {widget.type === 'temperature' ? (
                    <TemperatureGauge value={data?.temperature || 0} />
                ) : (
                    <span className={`text-4xl font-bold font-['Outfit'] ${widget.type === 'door' ? (data?.door_status ? 'text-red-400' : 'text-green-400') : 'text-white'}`}>
                        {getValue()}
                    </span>
                )}
            </div>

            {/* Footer / Status */}
            <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                <span>Updated just now</span>
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
        </div>
    );
};

export default WidgetCard;
