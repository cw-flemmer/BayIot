import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface AuthState {
    user: any | null;
    token: string | null;
    tenantDomain: string | null;
    isLoading: boolean;
    signIn: (email: string, pass: string, domain?: string) => Promise<void>;
    signOut: () => Promise<void>;
    loadStorageData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    tenantDomain: null,
    isLoading: true,

    loadStorageData: async () => {
        try {
            const storedToken = await SecureStore.getItemAsync('auth_token');
            const storedUser = await SecureStore.getItemAsync('auth_user');
            const storedDomain = await SecureStore.getItemAsync('tenant_domain');

            set({
                token: storedToken || null,
                user: storedUser ? JSON.parse(storedUser) : null,
                tenantDomain: (storedDomain && storedDomain !== 'undefined') ? storedDomain : null,
                isLoading: false,
            });

        } catch (e) {
            console.error('Failed to load auth state', e);
            set({ isLoading: false });
        }
    },

    signIn: async (email: string, password: string, domain?: string) => {
        try {
            console.log(`[AuthStore] Attempting mobile signin for ${email}${domain ? ' at ' + domain : ''}`);

            const response = await api.post('/mobile/auth/login', { email, password, domain });

            console.log('[AuthStore] Login response data:', JSON.stringify(response.data));

            const { user: userData } = response.data;

            if (!userData) {
                throw new Error('No user data received from server.');
            }

            // For now, use a placeholder token to maintain "logged in" state in the app logic
            // providing the user didn't request valid JWTs yet.
            const accessToken = "MOBILE-SESSION-TOKEN";

            // Use domain if provided, otherwise grab domain returned from server
            const actualDomain = domain || userData.tenant_domain;

            // Ensure values are strings
            await SecureStore.setItemAsync('auth_token', String(accessToken));
            await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));
            if (actualDomain) {
                await SecureStore.setItemAsync('tenant_domain', String(actualDomain));
            } else {
                await SecureStore.deleteItemAsync('tenant_domain').catch(() => {});
            }

            set({
                token: accessToken,
                user: userData,
                tenantDomain: actualDomain,
            });

            console.log('[AuthStore] Signin successful');
        } catch (error: any) {
            console.error('[AuthStore] Signin error:', error);
            await SecureStore.deleteItemAsync('tenant_domain').catch(() => { });
            throw error;
        }
    },

    signOut: async () => {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
        await SecureStore.deleteItemAsync('tenant_domain');

        set({
            token: null,
            user: null,
            tenantDomain: null,
        });
    },
}));
