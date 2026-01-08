import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

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
        } catch (e) {
            console.error('Failed to load auth state', e);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string, domain: string) => {
        try {
            // Temporarily set domain for the login request (interceptor uses SecureStore)
            await SecureStore.setItemAsync('tenant_domain', domain);

            const response = await api.post('/auth/login', { email, password }, {
                headers: { 'X-Tenant-Domain': domain }
            });

            const { accessToken, user: userData } = response.data;

            await SecureStore.setItemAsync('auth_token', accessToken);
            await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));

            setToken(accessToken);
            setUser(userData);
            setTenantDomain(domain);
        } catch (error) {
            await SecureStore.deleteItemAsync('tenant_domain'); // Clean up on failure
            throw error;
        }
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
        await SecureStore.deleteItemAsync('tenant_domain');
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
