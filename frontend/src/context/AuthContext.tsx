import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface TenantItem {
    id: number;
    name: string;
    tier: string;
    status: string;
}

export type ActiveView = 'HOME' | 'TENANT_PORTAL' | 'SUPER_ADMIN';

interface AuthContextValue {
    token: string;
    role: string;
    normalizedRole: string;
    tenantId: string;
    activeView: ActiveView;
    selectedTenant: TenantItem | null;
    showRegisterModal: boolean;
    setShowRegisterModal: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveView: (view: ActiveView) => void;
    setTenantId: (id: string) => void;
    setSession: (token: string, role: string, tenantId?: number | null) => void;
    enterTenant: (tenant: TenantItem) => void;
    goHome: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [tenantId, setTenantId] = useState(localStorage.getItem('activeTenantId') || '');
    const [activeView, setActiveView] = useState<ActiveView>('HOME');
    const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        if (tenantId) {
            axios.defaults.headers.common['X-Tenant-ID'] = tenantId;
            localStorage.setItem('activeTenantId', tenantId);
        } else {
            delete axios.defaults.headers.common['X-Tenant-ID'];
        }
    }, [tenantId]);

    const setSession = (newToken: string, newRole: string, newTenantId?: number | null) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);

        if (newTenantId != null) {
            const idStr = newTenantId.toString();
            setTenantId(idStr);
            localStorage.setItem('activeTenantId', idStr);
        }
    };

    const enterTenant = (tenant: TenantItem) => {
        setSelectedTenant(tenant);
        setTenantId(tenant.id.toString());
        setActiveView('TENANT_PORTAL');
    };

    const goHome = () => {
        setSelectedTenant(null);
        setActiveView('HOME');
    };

    const logout = () => {
        localStorage.clear();
        setToken('');
        setRole('');
        setTenantId('');
        setSelectedTenant(null);
        setActiveView('HOME');
    };

    const normalizedRole = role ? role.replace('ROLE_', '').toUpperCase() : '';

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                normalizedRole,
                tenantId,
                activeView,
                selectedTenant,
                showRegisterModal,
                setShowRegisterModal,
                setActiveView,
                setTenantId,
                setSession,
                enterTenant,
                goHome,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};