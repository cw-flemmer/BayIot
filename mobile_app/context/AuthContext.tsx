import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { requestNotificationPermissions, registerBackgroundFetchAsync, initializeNotificationHandler, startForegroundPoll, stopForegroundPoll } from '../services/notificationService';

interface AuthContextType {
    user: any | null;
    token: string | null;
    tenantDomain: string | null;
    signIn: (email: string, pass: string, domain: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [tenantDomain, setTenantDomain] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('auth_token');
            const storedUser = await SecureStore.getItemAsync('auth_user');
            const storedDomain = await SecureStore.getItemAsync('tenant_domain');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            if (storedDomain) {
                setTenantDomain(storedDomain);
            }

            if (storedUser && storedDomain) {
                // Initialize notifications and background fetch on app load
                initializeNotificationHandler();
                const hasPermission = await requestNotificationPermissions();
                if (hasPermission) {
                    await registerBackgroundFetchAsync();
                    startForegroundPoll();
                    console.log('[AuthContext] Background & Foreground fetch registered on app load');
                }
            }
        } catch (e) {
            console.error('Failed to load auth state', e);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string, domain: string) => {
        try {
            console.log(`[AuthContext] Attempting mobile signin for ${email} at ${domain}`);

            const response = await api.post('/mobile/auth/login', { email, password, domain });

            console.log('[AuthContext] Login response data:', JSON.stringify(response.data));

            const { user: userData } = response.data;

            if (!userData) {
                throw new Error('No user data received from server.');
            }

            // For now, use a placeholder token to maintain "logged in" state in the app logic
            // providing the user didn't request valid JWTs yet.
            const accessToken = "MOBILE-SESSION-TOKEN";

            // Ensure values are strings
            await SecureStore.setItemAsync('auth_token', String(accessToken));
            await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));
            await SecureStore.setItemAsync('tenant_domain', String(domain));

            setToken(accessToken);
            setUser(userData);
            setTenantDomain(domain);

            // Initialize notifications after successful login
            initializeNotificationHandler();
            const hasPermission = await requestNotificationPermissions();
            if (hasPermission) {
                await registerBackgroundFetchAsync();
                startForegroundPoll();
                console.log('[AuthContext] Notification service initialized');
            }

            console.log('[AuthContext] Signin successful');
        } catch (error: any) {
            console.error('[AuthContext] Signin error:', error);
            await SecureStore.deleteItemAsync('tenant_domain').catch(() => { });
            throw error;
        }
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
        await SecureStore.deleteItemAsync('tenant_domain');
        stopForegroundPoll();
        setToken(null);
        setUser(null);
        setTenantDomain(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, tenantDomain, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
