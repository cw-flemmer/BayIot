import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenantInfo, setTenantInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTenantInfo = async () => {
        try {
            const response = await api.get('/tenant/info');
            console.log('Tenant Branding Info:', response.data);
            setTenantInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch tenant info:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenantInfo();
    }, []);

    return (
        <TenantContext.Provider value={{ tenantInfo, loading, refreshTenantInfo: fetchTenantInfo }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
