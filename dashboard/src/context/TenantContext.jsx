import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenantInfo, setTenantInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenantInfo = async () => {
            try {
                const response = await api.get('/tenant/info');
                setTenantInfo(response.data);
            } catch (error) {
                console.error('Failed to fetch tenant info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenantInfo();
    }, []);

    return (
        <TenantContext.Provider value={{ tenantInfo, loading }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
