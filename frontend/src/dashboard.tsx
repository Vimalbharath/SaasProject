import React, { useState } from 'react';
import {
    useLogin,
    useRegisterTenant,
    useGetPublicGames,
    useGetAllTenants,
    useGetPendingTenants,
    useApproveTenant,
    useDeleteTenant,
    useGetOrganizers,
    useAddOrganizer,
    useUpdateOrganizer,
    useDeleteOrganizer,
    useGetTenantGames,
    useCreateGame,
    useDeleteGame,
    useGetGames,
    useUpdateGameScore
} from '@saas/api-client';

function AppDashboard() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [tenantId, setTenantId] = useState(localStorage.getItem('activeTenantId') || '');

    // Auth state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginMutation = useLogin();

    // Public Registration
    const [regOrgName, setRegOrgName] = useState('');
    const [regTier, setRegTier] = useState('BASIC');
    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');
    const registerMutation = useRegisterTenant();

    // Queries & Mutations hooks
    const { data: publicGames, refetch: refetchPublicGames } = useGetPublicGames();
    const { data: allTenants, refetch: refetchAllTenants } = useGetAllTenants();
    const { data: pendingTenants, refetch: refetchPendingTenants } = useGetPendingTenants();
    const approveTenantMutation = useApproveTenant();
    const deleteTenantMutation = useDeleteTenant();

    const { data: organizers, refetch: refetchOrganizers } = useGetOrganizers();
    const addOrgMutation = useAddOrganizer();
    const updateOrgMutation = useUpdateOrganizer();
    const deleteOrgMutation = useDeleteOrganizer();

    const { data: tenantGames, refetch: refetchTenantGames } = useGetTenantGames();
    const createGameMutation = useCreateGame();
    const deleteGameMutation = useDeleteGame();

    const { data: organizerGames, refetch: refetchOrganizerGames } = useGetGames();
    const updateScoreMutation = useUpdateGameScore();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { data: { username, password } },
            {
                onSuccess: (res: any) => {
                    const data = res.data;
                    setToken(data.token);
                    setRole(data.role);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    if (data.tenantId) {
                        setTenantId(data.tenantId.toString());
                        localStorage.setItem('activeTenantId', data.tenantId.toString());
                    }
                    alert('Logged in successfully!');
                },
                onError: (err) => alert('Login failed: ' + err.message)
            }
        );
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(
            { data: { organizationName: regOrgName, tier: regTier, username: regUser, password: regPass } },
            {
                onSuccess: () => {
                    alert('Tenant registered successfully! Pending approval.');
                    setRegOrgName('');
                    setRegUser('');
                    setRegPass('');
                    refetchAllTenants();
                    refetchPendingTenants();
                },
                onError: (err) => alert('Registration failed: ' + err.message)
            }
        );
    };

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            minHeight: '100vh',
            padding: '30px 20px',
        },
        wrapper: {
            maxWidth: '1000px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '20px',
        },
        title: {
            fontSize: '24px',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#334155',
            marginTop: 0,
            marginBottom: '16px',
        },
        inputGroup: {
            marginBottom: '14px',
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '6px',
            color: '#475569',
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            boxSizing: 'border-box' as const,
        },
        button: {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
        },
        dangerButton: {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: '10px',
        },
        successButton: {
            backgroundColor: '#16a34a',
            color: '#ffffff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: '10px',
        },
        sessionBar: {
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        badge: {
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '14px',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Sports SaaS Platform</h1>
                    {token && (
                        <button
                            style={{ ...styles.button, backgroundColor: '#64748b' }}
                            onClick={() => {
                                localStorage.clear();
                                setToken('');
                                setRole('');
                                setTenantId('');
                                window.location.reload();
                            }}
                        >
                            Log Out
                        </button>
                    )}
                </div>

                {/* Session Bar */}
                <div style={styles.sessionBar}>
                    <div>
                        <strong>Session Status: </strong>
                        {token ? <span style={{ color: '#16a34a' }}>Authenticated</span> : <span style={{ color: '#dc2626' }}>Guest</span>}
                        {role && <span style={{ ...styles.badge, marginLeft: '12px' }}>{role}</span>}
                        {tenantId && <span style={{ marginLeft: '12px', color: '#64748b' }}>Tenant ID: {tenantId}</span>}
                    </div>
                </div>

                {/* Login Section */}
                {!token && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Sign In</h3>
                        <form onSubmit={handleLogin}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username</label>
                                <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" style={styles.button}>Sign In</button>
                        </form>
                    </div>
                )}

                {/* Public Registration Section */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Register New Organization</h3>
                    <form onSubmit={handleRegister}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Organization Name</label>
                            <input style={styles.input} value={regOrgName} onChange={(e) => setRegOrgName(e.target.value)} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Subscription Tier</label>
                            <input style={styles.input} value={regTier} onChange={(e) => setRegTier(e.target.value)} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admin Username</label>
                            <input style={styles.input} value={regUser} onChange={(e) => setRegUser(e.target.value)} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admin Password</label>
                            <input type="password" style={styles.input} value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                        </div>
                        <button type="submit" style={styles.button}>Register Tenant</button>
                    </form>
                </div>

                {/* Public Games */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Public Games & Scores</h3>
                    <button style={{ ...styles.button, marginBottom: '15px' }} onClick={() => refetchPublicGames()}>Refresh Games</button>
                    <ul style={styles.list}>
                        {Array.isArray(publicGames?.data) && publicGames.data.map((g: any) => (
                            <li key={g.id} style={styles.listItem}>
                                <span><strong>{g.title}</strong></span>
                                <span style={styles.badge}>Score: {g.scoreDetails || 'N/A'}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Super Admin Section */}
                {role === 'SUPER_ADMIN' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Super Admin Management</h3>
                        <button style={{ ...styles.button, marginBottom: '15px' }} onClick={() => { refetchAllTenants(); refetchPendingTenants(); }}>Load Tenants Data</button>
                        
                        <h4 style={{ color: '#475569', fontSize: '15px' }}>Pending Tenants</h4>
                        <ul style={{ ...styles.list, marginBottom: '20px' }}>
                            {Array.isArray(pendingTenants?.data) && pendingTenants.data.map((t: any) => (
                                <li key={t.id} style={styles.listItem}>
                                    <span>{t.name} ({t.tier})</span>
                                    <div>
                                        <span style={styles.badge}>{t.status}</span>
                                        <button style={styles.successButton} onClick={() => approveTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchPendingTenants(); refetchAllTenants(); } })}>Approve</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <h4 style={{ color: '#475569', fontSize: '15px' }}>All Tenants</h4>
                        <ul style={styles.list}>
                            {Array.isArray(allTenants?.data) && allTenants.data.map((t: any) => (
                                <li key={t.id} style={styles.listItem}>
                                    <span>{t.name} ({t.tier}) - <span style={styles.badge}>{t.status}</span></span>
                                    <button style={styles.dangerButton} onClick={() => deleteTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchAllTenants(); } })}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Tenant Admin Section */}
                {role === 'TENANT_ADMIN' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Tenant Administration</h3>
                        <button style={{ ...styles.button, marginBottom: '15px' }} onClick={() => { refetchOrganizers(); refetchTenantGames(); }}>Load Tenant Data</button>
                        
                        <h4 style={{ color: '#475569', fontSize: '15px' }}>Organizers</h4>
                        <button style={{ ...styles.button, marginBottom: '10px', fontSize: '12px', padding: '6px 10px' }} onClick={() => {
                            const u = prompt("Organizer username:");
                            const p = prompt("Organizer password:");
                            if (u && p) addOrgMutation.mutate({ data: { username: u, password: p } }, { onSuccess: () => refetchOrganizers() });
                        }}>Add Organizer</button>
                        <ul style={{ ...styles.list, marginBottom: '20px' }}>
                            {Array.isArray(organizers?.data) && organizers.data.map((org: any) => (
                                <li key={org.id} style={styles.listItem}>
                                    <span>{org.username} <span style={styles.badge}>{org.role}</span></span>
                                    <button style={styles.dangerButton} onClick={() => deleteOrgMutation.mutate({ id: org.id }, { onSuccess: () => refetchOrganizers() })}>Delete</button>
                                </li>
                            ))}
                        </ul>

                        <h4 style={{ color: '#475569', fontSize: '15px' }}>Tenant Games</h4>
                        <button style={{ ...styles.button, marginBottom: '10px', fontSize: '12px', padding: '6px 10px' }} onClick={() => {
                            const title = prompt("Game Title:");
                            if (title) createGameMutation.mutate({ data: { title, public: true, scoreDetails: '0-0' } }, { onSuccess: () => refetchTenantGames() });
                        }}>Create Game</button>
                        <ul style={styles.list}>
                            {Array.isArray(tenantGames?.data) && tenantGames.data.map((g: any) => (
                                <li key={g.id} style={styles.listItem}>
                                    <span>{g.title} <span style={styles.badge}>{g.public ? 'Public' : 'Private'}</span> - {g.scoreDetails}</span>
                                    <button style={styles.dangerButton} onClick={() => deleteGameMutation.mutate({ id: g.id }, { onSuccess: () => refetchTenantGames() })}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Organizer Section */}
                {role === 'ORGANIZER' && (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Organizer Portal</h3>
                        <button style={{ ...styles.button, marginBottom: '15px' }} onClick={() => refetchOrganizerGames()}>Load Assigned Games</button>
                        <ul style={styles.list}>
                            {Array.isArray(organizerGames?.data) && organizerGames.data.map((g: any) => (
                                <li key={g.id} style={styles.listItem}>
                                    <span><strong>{g.title}</strong> - Score: {g.scoreDetails}</span>
                                    <button style={styles.button} onClick={() => {
                                        const newScore = prompt("Enter new score details:", g.scoreDetails);
                                        const isPub = confirm("Make score public?");
                                        if (newScore !== null) {
                                            updateScoreMutation.mutate(
                                                { id: g.id, data: { scoreDetails: newScore, public: isPub } },
                                                { onSuccess: () => refetchOrganizerGames() }
                                            );
                                        }
                                    }}>Update Score</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppDashboard;
