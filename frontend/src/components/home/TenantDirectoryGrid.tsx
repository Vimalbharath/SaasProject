import React, { useState, useMemo } from 'react';
import { TenantItem, useAuth } from '../../context/AuthContext';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    tenants: TenantItem[];
    onRefresh: () => void;
}

export const TenantDirectoryGrid: React.FC<Props> = ({ tenants, onRefresh }) => {
    const { enterTenant } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTenants = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return tenants;
        return tenants.filter(
            (t) =>
                t.name.toLowerCase().includes(q) ||
                t.tier.toLowerCase().includes(q) ||
                t.id.toString().includes(q)
        );
    }, [tenants, searchQuery]);

    return (
        <section style={{ marginBottom: '48px' }}>
            <div style={styles.sectionHeader}>
                <div>
                    <h2 style={styles.sectionTitle}>Active Organizations & Clubs</h2>
                    <p style={styles.sectionSub}>Select an organization to enter its dedicated portal and manage matches.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="search"
                        placeholder="Search clubs by name or tier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ ...styles.input, width: '250px' }}
                    />
                    <button style={styles.secondaryBtn} onClick={onRefresh}>Refresh</button>
                </div>
            </div>

            <div style={styles.grid}>
                {filteredTenants.length === 0 && (
                    <p style={{ color: '#64748b' }}>
                        {searchQuery ? `No clubs match "${searchQuery}".` : 'No approved organizations yet.'}
                    </p>
                )}
                {filteredTenants.map((tenant) => (
                    <div key={tenant.id} style={styles.gridCard} onClick={() => enterTenant(tenant)}>
                        <div style={styles.cardTop}>
                            <span style={styles.tierBadge}>{tenant.tier}</span>
                            <span style={styles.tenantIdTag}>ID #{tenant.id}</span>
                        </div>
                        <h3 style={styles.gridCardTitle}>{tenant.name}</h3>
                        <p style={styles.gridCardDesc}>Click to enter {tenant.name} workspace portal →</p>
                    </div>
                ))}
            </div>
        </section>
    );
};