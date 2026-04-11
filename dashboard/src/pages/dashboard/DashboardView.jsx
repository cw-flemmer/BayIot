import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
// @ts-ignore
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { Plus, Save, ArrowLeft, Loader2, Layout, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import WidgetCard from './WidgetCard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from context
    const isCustomer = user?.role === 'customer';

    // Customers can edit layout (drag/resize) but cannot add/delete widgets
    // Admins can do everything
    const canManageWidgets = !isCustomer;
    const isEditMode = true; // Use a simpler logic: Grid is always editable/interactive for allowed users

    const [widgets, setWidgets] = useState([]);
    const [devices, setDevices] = useState([]);
    const [dashboardData, setDashboardData] = useState(null); // [NEW]
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Add Widget Form
    const [newWidget, setNewWidget] = useState({
        type: 'temperature',
        title: '',
        device_id: ''
    });

    useEffect(() => {
        fetchDashboardData();
    }, [id]);

    const fetchDashboardData = async () => {
        try {
            const [widgetsRes, devicesRes, dashboardRes] = await Promise.all([
                api.get(`/widgets/dashboard/${id}`),
                api.get('/devices'),
                api.get(`/dashboards/${id}`) // [NEW]
            ]);

            setDashboardData(dashboardRes.data); // [NEW]

            // ... (rest of filtering logic)
            // Debugging: Log the raw devices and ID
            console.log('Dashboard ID:', id);
            console.log('All Devices:', devicesRes.data);

            // Filter devices allocated to this dashboard
            const allocatedDevices = devicesRes.data.filter(d =>
                d.dashboard_id == id ||
                d.allocatedDashboard?.id == id
            );

            console.log('Allocated Devices:', allocatedDevices);
            setDevices(allocatedDevices);

            // Format widgets for grid
            const formattedWidgets = widgetsRes.data.map(w => ({
                ...w,
                ...w.position // Spread position (x, y, w, h)
            }));
            setWidgets(formattedWidgets || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLayoutChange = async (layout) => {
        // Update local state positions
        const updatedWidgets = widgets.map(w => {
            const gridItem = layout.find(l => l.i === w.id.toString());
            if (gridItem) {
                return {
                    ...w,
                    x: gridItem.x,
                    y: gridItem.y,
                    w: gridItem.w,
                    h: gridItem.h
                };
            }
            return w;
        });
        setWidgets(updatedWidgets);

        // In a real optimized app, we'd debounce this save
        // For now, we wait for explicit "Save" or just let it float in state 
        // until we decide to sync. But requirement says "widgets should be saved".
        // Let's implement individual update or bulk update.
        // For simplicity/robustness, let's update changed ones in background.

        updatedWidgets.forEach(async (w) => {
            try {
                await api.put(`/widgets/${w.id}`, {
                    position: { x: w.x, y: w.y, w: w.w, h: w.h }
                });
            } catch (err) {
                console.error("Failed to save position", err);
            }
        });
    };

    const handleAddWidget = async (e) => {
        e.preventDefault();
        try {
            // Auto-assign title and telemetry column if not set
            const title = newWidget.title || `${newWidget.type.charAt(0).toUpperCase() + newWidget.type.slice(1)} Widget`;
            const telemetry_column = newWidget.type === 'door' ? 'door_status' :
                newWidget.type === 'battery' ? 'battery_level' :
                    newWidget.type;

            const payload = {
                dashboard_id: parseInt(id),
                type: newWidget.type,
                title: title,
                device_id: newWidget.device_id,
                telemetry_column: telemetry_column,
                position: { x: 0, y: Infinity, w: 2, h: 2 } // Bottom of grid
            };

            await api.post('/widgets', payload);
            setIsModalOpen(false);
            setNewWidget({ type: 'temperature', title: '', device_id: '' });
            fetchDashboardData();
        } catch (error) {
            console.error('Add widget error:', error);
        }
    };

    const handleDeleteWidget = async (widgetId) => {
        if (!window.confirm("Remove this widget?")) return;
        try {
            await api.delete(`/widgets/${widgetId}`);
            setWidgets(prev => prev.filter(w => w.id !== widgetId));
        } catch (error) {
            console.error('Delete widget error:', error);
        }
    };

    const handleUpdateWidget = async (widgetId, updates) => {
        try {
            const res = await api.put(`/widgets/${widgetId}`, updates);
            setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, ...res.data } : w));
        } catch (error) {
            console.error('Update widget error:', error);
        }
    };

    // ... (Loading state)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard/list')} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold">{dashboardData ? dashboardData.name : 'Dashboard Editor'}</h2>
                        <p className="text-gray-500">{isCustomer ? 'View your dashboard' : 'Customize layout and add widgets'}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {!isCustomer && (
                        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Density</span>
                            <select
                                value={dashboardData?.columns || 6}
                                onChange={async (e) => {
                                    const newCols = parseInt(e.target.value);
                                    try {
                                        await api.put(`/dashboards/${id}`, { columns: newCols });
                                        setDashboardData({ ...dashboardData, columns: newCols });
                                    } catch (err) {
                                        console.error("Failed to update density", err);
                                    }
                                }}
                                className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="6" className="bg-[#0f172a]">Low (6)</option>
                                <option value="12" className="bg-[#0f172a]">Medium (12)</option>
                                <option value="18" className="bg-[#0f172a]">High (18)</option>
                                <option value="24" className="bg-[#0f172a]">Ultra (24)</option>
                            </select>
                        </div>
                    )}
                    {canManageWidgets && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
                        >
                            <Plus size={18} />
                            <span>Add Widget</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="min-h-[600px] p-6">
                {widgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                        <Layout size={48} className="mb-4 opacity-20" />
                        <p>No widgets yet. {canManageWidgets ? 'Click "Add Widget" to start.' : ''}</p>
                    </div>
                ) : (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: widgets }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: dashboardData?.columns || 6, md: 6, sm: 4, xs: 2, xxs: 1 }} // Dynamic columns
                        rowHeight={100}
                        draggableHandle=".drag-handle"
                        onLayoutChange={handleLayoutChange}
                        isDraggable={isEditMode}
                        isResizable={isEditMode}
                    >
                        {widgets.map((widget) => (
                            <div key={widget.id} data-grid={{ x: widget.x, y: widget.y, w: widget.w, h: widget.h }}>
                                <WidgetCard
                                    widget={widget}
                                    onDelete={handleDeleteWidget}
                                    onUpdate={handleUpdateWidget}
                                    isDraggable={isEditMode}
                                    showDelete={canManageWidgets}
                                    canManageSettings={true}
                                />
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                )}
            </div>

            {/* Add Widget Modal */}
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
                            className="bg-[#0f172a] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl text-white pointer-events-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold">Add Widget</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddWidget} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Widget Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['temperature', 'humidity', 'door', 'battery'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewWidget({ ...newWidget, type })}
                                                className={`p-3 rounded-xl border text-sm font-bold capitalize transition-all ${newWidget.type === type
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Select Device</label>
                                    <select
                                        required
                                        value={newWidget.device_id}
                                        onChange={(e) => setNewWidget({ ...newWidget, device_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] appearance-none text-white"
                                    >
                                        <option value="" className="bg-[#0f172a]">Select a source device</option>
                                        {devices.map(d => (
                                            <option key={d.id} value={d.device_id} className="bg-[#0f172a]">
                                                {d.device_id} (Allocated)
                                            </option>
                                        ))}
                                    </select>
                                    {devices.length === 0 && (
                                        <p className="text-xs text-orange-400 mt-1">No devices allocated to this dashboard.</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={newWidget.title}
                                        onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-['Outfit'] text-white"
                                        placeholder="Display name"
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
                                        disabled={!newWidget.device_id}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 rounded-2xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>Add to Grid</span>
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

export default DashboardView;
