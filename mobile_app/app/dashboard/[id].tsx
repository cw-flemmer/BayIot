import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import api from '../../services/api';
import { ChevronLeft, Layout, RefreshCw } from 'lucide-react-native';
import MobileWidgetCard from '../../components/MobileWidgetCard';

interface Widget {
    id: number;
    type: string;
    title: string;
    device_id: string;
    telemetry_column?: string;
}

export default function DashboardDetailScreen() {
    const { id, name } = useLocalSearchParams();
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWidgets = useCallback(async () => {
        try {
            // Backend route is /api/widgets/dashboard/:dashboardId
            const response = await api.get(`/widgets/dashboard/${id}`);
            setWidgets(response.data);
        } catch (error) {
            console.error('Failed to fetch widgets', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchWidgets();
    }, [fetchWidgets]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchWidgets();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: String(name || 'Dashboard'),
                    headerStyle: { backgroundColor: '#0f172a' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                            <ChevronLeft color="#fff" size={28} />
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
                }
            >
                <View style={styles.headerInfo}>
                    <Text style={styles.subtitle}>Dashboard Devices & Sensors</Text>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {widgets.map((widget) => (
                            <MobileWidgetCard key={widget.id} widget={widget} />
                        ))}
                    </View>
                )}

                {!loading && widgets.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Layout color="#1e293b" size={64} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyText}>No widgets found for this dashboard.</Text>
                        <Text style={styles.emptySubtext}>Use the web dashboard to add sensors and controls.</Text>
                        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                            <RefreshCw color="#3b82f6" size={20} style={{ marginRight: 8 }} />
                            <Text style={styles.refreshButtonText}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
        minHeight: Dimensions.get('window').height - 100,
    },
    headerInfo: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    centered: {
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#94a3b8',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#475569',
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 24,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    refreshButtonText: {
        color: '#3b82f6',
        fontWeight: 'bold',
    }
});
