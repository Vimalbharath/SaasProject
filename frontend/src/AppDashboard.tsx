import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useGetPublicGames } from '@saas/api-client';
import { AuthProvider, TenantItem, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/home/HomeView';
import { TenantPortalView } from './components/tenant/TenantPortalView';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';
import { dashboardStyles as styles } from './styles/dashboardStyles';

const DashboardShell: React.FC = () => {
    const { activeView, normalizedRole } = useAuth();
    const [publicTenants, setPublicTenants] = useState<TenantItem[]>([]);
    const { data: publicGames, refetch: refetchPublicGames } = useGetPublicGames();

    const fetchPublicTenants = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/public/tenants');
            setPublicTenants(res.data || []);
        } catch (err) {
            console.error('Failed to load public tenants', err);
        }
    }, []);

    useEffect(() => {
        fetchPublicTenants();
    }, [fetchPublicTenants]);

    return (
        <div style={styles.page}>
            <Navbar />

            {activeView === 'HOME' && (
                <HomeView
                    publicTenants={publicTenants}
                    onRefreshTenants={fetchPublicTenants}
                    publicGames={publicGames?.data}
                    onRefreshGames={() => refetchPublicGames()}
                />
            )}

            {activeView === 'TENANT_PORTAL' && (
                <TenantPortalView onPublicGamesRefresh={() => refetchPublicGames()} />
            )}

            {activeView === 'SUPER_ADMIN' && normalizedRole === 'SUPER_ADMIN' && (
                <div style={styles.container}>
                    <SuperAdminPanel onTenantsChanged={fetchPublicTenants} />
                </div>
            )}
        </div>
    );
};

export default function AppDashboard() {
    return (
        <AuthProvider>
            <DashboardShell />
        </AuthProvider>
    );
}