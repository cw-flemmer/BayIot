import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Thermometer, Droplets, Battery, DoorOpen, Bolt, AlertCircle } from 'lucide-react-native';

interface WidgetProps {
    widget: {
        id: number;
        type: string;
        title: string;
        device_id: string;
        telemetry_column?: string;
    };
}

const MobileWidgetCard: React.FC<WidgetProps> = ({ widget }) => {
    const { user, tenantDomain } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchTelemetry = useCallback(async () => {
        if (!widget.device_id || !user?.email || !tenantDomain) return;
        try {
            const response = await api.post(`/mobile/telemetry/latest/${widget.device_id}`, {
                email: user.email,
                domain: tenantDomain
            });
            setData(response.data);
            setError(false);
        } catch (err) {
            console.error(`Error fetching telemetry for ${widget.device_id}:`, err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [widget.device_id, user, tenantDomain]);

    useEffect(() => {
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, [fetchTelemetry]);

    const getIcon = () => {
        switch (widget.type) {
            case 'temperature': return <Thermometer color="#f87171" size={24} />;
            case 'humidity': return <Droplets color="#60a5fa" size={24} />;
            case 'battery': return <Battery color="#4ade80" size={24} />;
            case 'door': return <DoorOpen color="#fbbf24" size={24} />;
            default: return <Bolt color="#94a3b8" size={24} />;
        }
    };

    const getValue = () => {
        if (loading) return '--';
        if (!data) return 'N/A';

        switch (widget.type) {
            case 'temperature':
                return `${data.temperature?.toFixed(1) || '0'}°C`;
            case 'humidity':
                return `${data.humidity?.toFixed(1) || '0'}%`;
            case 'battery':
                return `${data.battery_level || '0'}%`;
            case 'door':
                return data.door_status ? 'OPEN' : 'CLOSED';
            default:
                // Use custom column if specified
                if (widget.telemetry_column && data[widget.telemetry_column] !== undefined) {
                    return data[widget.telemetry_column];
                }
                return 'N/A';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    {getIcon()}
                </View>
                <Text style={styles.title} numberOfLines={1}>{widget.title || widget.type}</Text>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                ) : (
                    <Text style={[
                        styles.value,
                        widget.type === 'door' && { color: data?.door_status ? '#f87171' : '#4ade80' }
                    ]}>
                        {getValue()}
                    </Text>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.deviceId}>{widget.device_id}</Text>
                {error && <AlertCircle color="#ef4444" size={14} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        width: '48%', // Allow 2 columns
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94a3b8',
        flex: 1,
        textTransform: 'capitalize',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.03)',
        paddingTop: 8,
    },
    deviceId: {
        fontSize: 10,
        color: '#475569',
        fontWeight: '500',
    }
});

export default MobileWidgetCard;
