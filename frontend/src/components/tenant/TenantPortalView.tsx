import React, { useState } from 'react';
import { useLogin } from '@saas/api-client';
import { useAuth } from '../../context/AuthContext';
import { TenantAdminPanel } from './TenantAdminPanel';
import { OrganizerScorePanel } from './OrganiserScorePanel';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    onPublicGamesRefresh: () => void;
}

export const TenantPortalView: React.FC<Props> = ({ onPublicGamesRefresh }) => {
    const {
        token,
        tenantId,
        normalizedRole,
        selectedTenant,
        setSession,
        setActiveView,
    } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginMutation = useLogin();

    if (!selectedTenant) return null;

    const isAuthorizedForTenant =
        Boolean(token) &&
        (tenantId === selectedTenant.id.toString() || normalizedRole === 'SUPER_ADMIN');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { data: { username, password } },
            {
                onSuccess: (res: any) => {
                    const data = res.data || res;
                    if (
                        selectedTenant &&
                        data.tenantId &&
                        data.tenantId !== selectedTenant.id &&
                        data.role !== 'ROLE_SUPER_ADMIN'
                    ) {
                        alert(`This account does not belong to ${selectedTenant.name}.`);
                        return;
                    }

                    setSession(data.token, data.role, data.tenantId);
                    setUsername('');
                    setPassword('');

                    if (data.role === 'ROLE_SUPER_ADMIN') {
                        setActiveView('SUPER_ADMIN');
                    }
                },
                onError: (err: any) => alert('Login failed: ' + (err.response?.data || err.message)),
            }
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.tenantBanner}>
                <div>
                    <span style={styles.tierBadge}>{selectedTenant.tier} WORKSPACE</span>
                    <h1 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a' }}>
                        {selectedTenant.name}
                    </h1>
                </div>
                <span style={{ color: '#475569', fontSize: '14px' }}>
                    Isolated Tenant Portal • ID #{selectedTenant.id}
                </span>
            </div>

            {!isAuthorizedForTenant ? (
                <div style={{ ...styles.card, maxWidth: '440px', margin: '40px auto' }}>
                    <h3 style={styles.sectionTitle}>Sign in to {selectedTenant.name}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                        Enter your Tenant Admin or Organizer credentials for <strong>{selectedTenant.name}</strong>.
                    </p>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={styles.label}>Username</label>
                            <input
                                style={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" style={{ ...styles.primaryBtn, width: '100%' }}>
                            Access {selectedTenant.name} Workspace
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    {normalizedRole === 'TENANT_ADMIN' && <TenantAdminPanel />}
                    {normalizedRole === 'ORGANIZER' && (
                        <OrganizerScorePanel onScoreOrVisibilityChange={onPublicGamesRefresh} />
                    )}
                </div>
            )}
        </div>
    );
};