import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTenant } from '../../context/TenantContext.jsx';
import {
    LayoutDashboard,
    Cpu,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    ChevronRight,
    Layout,
    Plus,
    Trash2,
    Edit3,
    Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api'; // [NEW] Import API
import SettingsPage from './Settings.jsx';
import DashboardsPage from './Dashboards.jsx';
import DashboardView from './DashboardView.jsx';
import TenantsPage from './Tenants.jsx';
import DevicesPage from './Devices.jsx';

const SidebarItem = ({ icon: Icon, label, to, active, isOpen }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
                <span className="font-medium whitespace-nowrap">{label}</span>
            )}
        </motion.div>
    </Link>
);

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const { tenantInfo } = useTenant();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isCustomer = user?.role === 'customer';

    // Redirect customers from overview to list
    React.useEffect(() => {
        if (isCustomer && location.pathname === '/dashboard') {
            navigate('/dashboard/list', { replace: true });
        }
    }, [isCustomer, location.pathname, navigate]);

    const getLogoUrl = (logoPath) => {
        if (!logoPath || logoPath === '') return null;
        if (logoPath.startsWith('http')) return logoPath;
        if (logoPath.startsWith('/')) return logoPath;
        if (logoPath.startsWith('data:')) return logoPath;
        return `/images/${logoPath}`;
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
        { icon: Layout, label: 'Dashboards', to: '/dashboard/list', adminOnly: true },
        { icon: Building, label: 'Tenants', to: '/dashboard/tenants', siteAdminOnly: true },
        { icon: Cpu, label: 'Devices', to: '/dashboard/devices', adminOnly: true },
        { icon: Users, label: 'Users', to: '/dashboard/users', adminOnly: true },
        { icon: Settings, label: 'Settings', to: '/dashboard/settings', adminOnly: true },
    ].filter(item => {
        if (user?.role === 'site-admin') return true;
        if (item.siteAdminOnly) return false;
        return !item.adminOnly || user?.role === 'admin';
    });

    return (
        <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-['Outfit']">
            {/* Sidebar - Hidden for customers */}
            {!isCustomer && (
                <motion.aside
                    initial={false}
                    animate={{ width: isSidebarOpen ? 260 : 80 }}
                    className="relative bg-white/5 border-r border-white/10 flex flex-col z-30"
                >
                    <div className="p-6 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center space-x-3"
                                >
                                    {tenantInfo?.logo ? (
                                        <img src={getLogoUrl(tenantInfo.logo)} alt="Logo" className="h-8" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
                                            {tenantInfo?.name?.[0] || 'B'}
                                        </div>
                                    )}
                                    <span className="font-bold text-lg truncate max-w-[140px]">
                                        {tenantInfo?.name || 'BayIot'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                                isOpen={isSidebarOpen}
                            />
                        ))}
                    </nav>

                    <div className="p-4 mt-auto">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all ${!isSidebarOpen && 'justify-center'}`}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </motion.aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md relative z-20">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search dashboard..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {!isCustomer ? (
                            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-[#020617]" />
                            </button>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-sm font-bold"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        )}
                        <div className="h-8 w-px bg-white/10 mx-2" />
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/20">
                                {user?.name?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Area */}
                <main className="flex-1 overflow-y-auto p-8 relative z-10">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/list" element={<DashboardsPage />} />
                        <Route path="/list/:id" element={<DashboardView />} />

                        {!isCustomer && (
                            <>
                                <Route path="/tenants" element={<TenantsPage />} />
                                <Route path="/devices" element={<DevicesPage />} />
                                <Route path="/users" element={<div className="text-2xl font-bold">User Management Coming Soon</div>} />
                                <Route path="/settings" element={<SettingsPage />} />
                            </>
                        )}

                        {/* Fallback for unauthorized pages */}
                        {isCustomer && (
                            <Route path="*" element={<Navigate to="/dashboard/list" replace />} />
                        )}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

const Overview = () => {
    const [stats, setStats] = useState({ devices: '...', customers: '...' });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const [devicesRes, customersRes] = await Promise.all([
                    api.get('/devices'),
                    api.get('/customers')
                ]);
                setStats({
                    devices: devicesRes.data.length,
                    customers: customersRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                setStats({ devices: '-', customers: '-' });
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Overview</h2>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                    <span>Export Data</span>
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Devices', value: stats.devices, change: '+12%', color: 'blue' },
                    { label: 'Total Customers', value: stats.customers, change: '+3%', color: 'purple' },
                    { label: 'Uptime', value: '99.99%', change: 'Stable', color: 'green' },
                    { label: 'Storage Used', value: '4.2 TB', change: '+1.2%', color: 'pink' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.07] transition-all group"
                    >
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold">{stat.value}</h3>
                            <span className={`text-xs px-2 py-1 rounded-lg ${stat.color === 'green' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for Charts/Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 h-[400px] rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Device Activity</h3>
                    <div className="h-full w-full flex items-center justify-center text-gray-600 border-2 border-dashed border-white/10 rounded-2xl">
                        Chart visualization will appear here
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 h-[400px] rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Recent Alerts</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Cpu size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Device #0{n} Offline</p>
                                    <p className="text-xs text-gray-500">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default DashboardLayout;
