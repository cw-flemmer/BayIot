import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Bell, Check, CheckCheck } from 'lucide-react-native';
import api from '../services/api';

interface Notification {
    id: number;
    device_id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.card, !item.is_read && styles.unreadCard]}
            onPress={() => !item.is_read && markAsRead(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Bell color={item.is_read ? '#64748b' : '#3b82f6'} size={20} />
            </View>
            <View style={styles.content}>
                <Text style={[styles.message, !item.is_read && styles.unreadMessage]}>
                    {item.message}
                </Text>
                <Text style={styles.device}>Device: {item.device_id}</Text>
                <Text style={styles.time}>
                    {new Date(item.created_at).toLocaleString()}
                </Text>
            </View>
            {item.is_read && (
                <CheckCheck color="#4ade80" size={18} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                {notifications.some(n => !n.is_read) && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                        <Check color="#3b82f6" size={18} />
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotifications(); }} tintColor="#3b82f6" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Bell color="#1e293b" size={64} />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    markAllText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    unreadCard: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    message: {
        fontSize: 15,
        color: '#94a3b8',
        marginBottom: 6,
        lineHeight: 20,
    },
    unreadMessage: {
        color: '#ffffff',
        fontWeight: '500',
    },
    device: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    time: {
        fontSize: 11,
        color: '#475569',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 16,
    },
});
