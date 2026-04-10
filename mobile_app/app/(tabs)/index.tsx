import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { router } from 'expo-router';
import { Layout, ChevronRight, LogOut, RefreshCw } from 'lucide-react-native';

interface Dashboard {
  id: number;
  name: string;
  description: string;
}

export default function HomeScreen() {
  const { user, signOut, tenantDomain } = useAuthStore();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboards = useCallback(async () => {
    try {
      if (!user?.email || !tenantDomain) return; // Wait for auth loading if needed
      const response = await api.post('/mobile/dashboards/list', {
        email: user.email,
        domain: tenantDomain
      });
      setDashboards(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, tenantDomain]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboards();
  };

  const renderItem = ({ item }: { item: Dashboard }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/dashboard/${item.id}?name=${encodeURIComponent(item.name)}` as any)}
    >
      <View style={styles.cardIcon}>
        <Layout color="#3b82f6" size={24} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
      </View>
      <ChevronRight color="#475569" size={20} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut color="#f87171" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Your Dashboards</Text>
        <Text style={styles.count}>{dashboards.length} total</Text>
      </View>

      <FlatList
        data={dashboards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Layout color="#1e293b" size={64} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No dashboards allocated yet.</Text>
            <Text style={styles.emptySubtext}>Contact your administrator to get started.</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <RefreshCw color="#3b82f6" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  welcome: {
    fontSize: 14,
    color: '#94a3b8',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  count: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f172a',
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
