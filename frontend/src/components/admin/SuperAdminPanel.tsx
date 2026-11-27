import React from 'react';
import {
    useGetAllTenants,
    useGetPendingTenants,
    useApproveTenant,
    useDeleteTenant,
} from '@saas/api-client';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    onTenantsChanged: () => void;
}

export const SuperAdminPanel: React.FC<Props> = ({ onTenantsChanged }) => {
    const { data: allTenants, refetch: refetchAllTenants } = useGetAllTenants();
    const { data: pendingTenants, refetch: refetchPendingTenants } = useGetPendingTenants();
    const approveTenantMutation = useApproveTenant();
    const deleteTenantMutation = useDeleteTenant();

    const refreshAll = () => {
        refetchPendingTenants();
        refetchAllTenants();
        onTenantsChanged();
    };

    return (
        <div style={styles.card}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Platform Super Admin</h3>
                <button style={styles.secondaryBtn} onClick={refreshAll}>
                    Refresh
                </button>
            </div>

            <h4>Pending Approvals</h4>
            {Array.isArray(pendingTenants?.data) &&
                pendingTenants?.data.map((t: any) => (
                    <div key={t.id} style={styles.listRow}>
                        <span>
                            {t.name} ({t.tier})
                        </span>
                        <button
                            style={styles.successBtn}
                            onClick={() =>
                                approveTenantMutation.mutate({ id: t.id }, { onSuccess: refreshAll })
                            }
                        >
                            Approve Organization
                        </button>
                    </div>
                ))}

            <h4 style={{ marginTop: '24px' }}>All Registered Tenants</h4>
            {Array.isArray(allTenants?.data) &&
                allTenants?.data.map((t: any) => (
                    <div key={t.id} style={styles.listRow}>
                        <span>
                            {t.name} ({t.tier}) — <strong>{t.status}</strong>
                        </span>
                        <button
                            style={styles.dangerBtn}
                            onClick={() =>
                                deleteTenantMutation.mutate({ id: t.id }, { onSuccess: refreshAll })
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))}
        </div>
    );
};