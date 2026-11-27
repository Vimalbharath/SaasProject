import React, { useState, useEffect } from 'react';
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
    useDeleteOrganizer,
    useGetTenantGames,
    useCreateGame,
    useDeleteGame,
    useGetGames,
    useUpdateGameScore
} from '@saas/api-client';
import axios from 'axios';

interface TenantItem {
    id: number;
    name: string;
    tier: string;
    status: string;
}

function AppDashboard() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [tenantId, setTenantId] = useState(localStorage.getItem('activeTenantId') || '');

    // Navigation & Portal State
    const [activeView, setActiveView] = useState<'HOME' | 'TENANT_PORTAL' | 'SUPER_ADMIN'>('HOME');
    const [selectedTenant, setSelectedTenant] = useState<TenantItem | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [publicTenants, setPublicTenants] = useState<TenantItem[]>([]);

    // Sync Axios Headers
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

    // Fetch Public Approved Tenants for Homepage Grid
    const fetchPublicTenants = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/public/tenants');
            setPublicTenants(res.data || []);
        } catch (err) {
            console.error('Failed to load public tenants', err);
        }
    };

    useEffect(() => {
        fetchPublicTenants();
    }, []);

    // Auth & Registration States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginMutation = useLogin();

    const [regOrgName, setRegOrgName] = useState('');
    const [regTier, setRegTier] = useState('FREE');
    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');
    const registerMutation = useRegisterTenant();

    // Orval Hooks
    const { data: publicGames, refetch: refetchPublicGames } = useGetPublicGames();
    const { data: allTenants, refetch: refetchAllTenants } = useGetAllTenants();
    const { data: pendingTenants, refetch: refetchPendingTenants } = useGetPendingTenants();
    const approveTenantMutation = useApproveTenant();
    const deleteTenantMutation = useDeleteTenant();

    const { data: organizers, refetch: refetchOrganizers } = useGetOrganizers();
    const addOrgMutation = useAddOrganizer();
    const deleteOrgMutation = useDeleteOrganizer();

    const { data: tenantGames, refetch: refetchTenantGames } = useGetTenantGames();
    const createGameMutation = useCreateGame();
    const deleteGameMutation = useDeleteGame();

    const { data: organizerGames, refetch: refetchOrganizerGames } = useGetGames();
    const updateScoreMutation = useUpdateGameScore();

    const normalizedRole = role ? role.replace('ROLE_', '').toUpperCase() : '';

    // Handle Clicking a Tenant Card from the Homepage Grid
    const handleEnterTenant = (tenant: TenantItem) => {
        setSelectedTenant(tenant);
        setTenantId(tenant.id.toString());
        setActiveView('TENANT_PORTAL');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { data: { username, password } },
            {
                onSuccess: (res: any) => {
                    const data = res.data || res;
                    // Prevent logging into a different tenant's workspace
                    if (selectedTenant && data.tenantId && data.tenantId !== selectedTenant.id && data.role !== 'ROLE_SUPER_ADMIN') {
                        alert(`This account does not belong to ${selectedTenant.name}.`);
                        return;
                    }

                    setToken(data.token);
                    setRole(data.role);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);

                    if (data.tenantId) {
                        setTenantId(data.tenantId.toString());
                        localStorage.setItem('activeTenantId', data.tenantId.toString());
                    }
                    if (data.role === 'ROLE_SUPER_ADMIN') {
                        setActiveView('SUPER_ADMIN');
                    }
                },
                onError: (err: any) => alert('Login failed: ' + (err.response?.data || err.message))
            }
        );
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(
            { data: { organizationName: regOrgName, tier: regTier, username: regUser, password: regPass } },
            {
                onSuccess: () => {
                    alert('Registration submitted! Your workspace will appear on the directory once approved.');
                    setRegOrgName('');
                    setRegUser('');
                    setRegPass('');
                    setShowRegisterModal(false);
                },
                onError: (err: any) => alert('Registration failed: ' + (err.response?.data || err.message))
            }
        );
    };

    const handleLogout = () => {
        localStorage.clear();
        setToken('');
        setRole('');
        setTenantId('');
        setSelectedTenant(null);
        setActiveView('HOME');
    };

    return (
        <div style={styles.page}>
            {/* Top Navigation Bar */}
            <nav style={styles.navbar}>
                <div style={styles.navInner}>
                    <span
                        style={styles.brand}
                        onClick={() => { setSelectedTenant(null); setActiveView('HOME'); }}
                    >
                        🏆 ArenaFlow SaaS
                    </span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {activeView !== 'HOME' && (
                            <button style={styles.secondaryBtn} onClick={() => { setSelectedTenant(null); setActiveView('HOME'); }}>
                                ← Back to Directory
                            </button>
                        )}
                        {normalizedRole === 'SUPER_ADMIN' && (
                            <button style={styles.secondaryBtn} onClick={() => setActiveView('SUPER_ADMIN')}>
                                Super Admin Console
                            </button>
                        )}
                        {!token ? (
                            <button style={styles.primaryBtn} onClick={() => setShowRegisterModal(!showRegisterModal)}>
                                + Register Organization
                            </button>
                        ) : (
                            <button style={styles.dangerBtn} onClick={handleLogout}>
                                Log Out ({normalizedRole})
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* VIEW 1: GLOBAL HOMEPAGE */}
            {activeView === 'HOME' && (
                <div>
                    {/* Hero Banner */}
                    <section style={styles.hero}>
                        <div style={styles.container}>
                            <span style={styles.heroPill}>MULTI-TENANT TOURNAMENT ENGINE</span>
                            <h1 style={styles.heroTitle}>Run Leagues, Live Scoreboards & Clubs in One Place.</h1>
                            <p style={styles.heroSubtitle}>
                                Launch an isolated workspace for your sports club, assign match organizers, and broadcast real-time scores to fans everywhere.
                            </p>
                            <div style={styles.heroActions}>
                                <button style={styles.heroPrimaryBtn} onClick={() => setShowRegisterModal(true)}>
                                    Launch Your Club Workspace
                                </button>
                                <a href="#live-scores" style={styles.heroSecondaryBtn}>
                                    Explore Live Scores ↓
                                </a>
                            </div>
                        </div>
                    </section>

                    <div style={styles.container}>
                        {/* Collapsible Tenant Registration Form */}
                        {showRegisterModal && (
                            <div style={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={styles.sectionTitle}>Create New Organization Workspace</h3>
                                    <button style={styles.secondaryBtn} onClick={() => setShowRegisterModal(false)}>Close</button>
                                </div>
                                <form onSubmit={handleRegister} style={styles.formGrid}>
                                    <div>
                                        <label style={styles.label}>Organization / Club Name</label>
                                        <input style={styles.input} placeholder="e.g., Chennai Super Strikers" value={regOrgName} onChange={(e) => setRegOrgName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Plan Tier</label>
                                        <select style={styles.input} value={regTier} onChange={(e) => setRegTier(e.target.value)}>
                                            <option value="FREE">Free Tier</option>
                                            <option value="PRO">Pro Tier</option>
                                            <option value="ADVANCED">Advanced Tier</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={styles.label}>Admin Username</label>
                                        <input style={styles.input} value={regUser} onChange={(e) => setRegUser(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Admin Password</label>
                                        <input type="password" style={styles.input} value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <button type="submit" style={styles.primaryBtn}>Submit Registration</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tenant Directory Grid */}
                        <section style={{ marginBottom: '48px' }}>
                            <div style={styles.sectionHeader}>
                                <div>
                                    <h2 style={styles.sectionTitle}>Active Organizations & Clubs</h2>
                                    <p style={styles.sectionSub}>Select an organization to enter its dedicated portal and manage matches.</p>
                                </div>
                                <button style={styles.secondaryBtn} onClick={fetchPublicTenants}>Refresh</button>
                            </div>

                            <div style={styles.grid}>
                                {publicTenants.length === 0 && (
                                    <p style={{ color: '#64748b' }}>No approved organizations yet. Register one above or approve via Super Admin.</p>
                                )}
                                {publicTenants.map((tenant) => (
                                    <div key={tenant.id} style={styles.gridCard} onClick={() => handleEnterTenant(tenant)}>
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

                        {/* Public Games Grid */}
                        <section id="live-scores">
                            <div style={styles.sectionHeader}>
                                <div>
                                    <h2 style={styles.sectionTitle}>Live Public Scoreboard</h2>
                                    <p style={styles.sectionSub}>Real-time scores published across all active organizations.</p>
                                </div>
                                <button style={styles.secondaryBtn} onClick={() => refetchPublicGames()}>Refresh Scores</button>
                            </div>

                            <div style={styles.grid}>
                                {Array.isArray(publicGames?.data) && publicGames?.data.map((game: any) => (
                                    <div key={game.id} style={styles.scoreCard}>
                                        <div style={styles.liveIndicator}>● LIVE / PUBLIC</div>
                                        <h3 style={styles.gridCardTitle}>{game.title}</h3>
                                        <div style={styles.scoreBox}>{game.scoreDetails || 'Match Scheduled'}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* VIEW 2: DEDICATED TENANT PORTAL (Behaves like a separate web app per tenant) */}
            {activeView === 'TENANT_PORTAL' && selectedTenant && (
                <div style={styles.container}>
                    <div style={styles.tenantBanner}>
                        <div>
                            <span style={styles.tierBadge}>{selectedTenant.tier} WORKSPACE</span>
                            <h1 style={{ margin: '8px 0 0 0', fontSize: '28px', color: '#0f172a' }}>{selectedTenant.name}</h1>
                        </div>
                        <span style={{ color: '#475569', fontSize: '14px' }}>Isolated Tenant Portal • ID #{selectedTenant.id}</span>
                    </div>

                    {/* Prompt for Login if user is not authenticated for this tenant */}
                    {(!token || (tenantId !== selectedTenant.id.toString() && normalizedRole !== 'SUPER_ADMIN')) ? (
                        <div style={{ ...styles.card, maxWidth: '440px', margin: '40px auto' }}>
                            <h3 style={styles.sectionTitle}>Sign in to {selectedTenant.name}</h3>
                            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                                Enter your Tenant Admin or Organizer credentials for <strong>{selectedTenant.name}</strong>.
                            </p>
                            <form onSubmit={handleLogin}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={styles.label}>Username</label>
                                    <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} required />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={styles.label}>Password</label>
                                    <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <button type="submit" style={{ ...styles.primaryBtn, width: '100%' }}>
                                    Access {selectedTenant.name} Workspace
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Authenticated Tenant Workspace (Admin or Organizer View) */
                        <div>
                            {normalizedRole === 'TENANT_ADMIN' && (
                                <div style={styles.card}>
                                    <div style={styles.sectionHeader}>
                                        <h3 style={styles.sectionTitle}>Workspace Administration</h3>
                                        <button style={styles.secondaryBtn} onClick={() => { refetchOrganizers(); refetchTenantGames(); }}>
                                            Sync Workspace Data
                                        </button>
                                    </div>

                                    {/* Organizers Management */}
                                    <div style={{ marginBottom: '28px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <h4 style={{ margin: 0 }}>Staff & Organizers</h4>
                                            <button style={styles.primaryBtn} onClick={() => {
                                                const u = prompt('New Organizer Username:');
                                                const p = prompt('New Organizer Password:');
                                                if (u && p) addOrgMutation.mutate({ data: { username: u, password: p } }, { onSuccess: () => refetchOrganizers() });
                                            }}>+ Add Organizer</button>
                                        </div>
                                        {Array.isArray(organizers?.data) && organizers?.data.map((org: any) => (
                                            <div key={org.id} style={styles.listRow}>
                                                <span><strong>{org.username}</strong> ({org.role})</span>
                                                <button style={styles.dangerBtn} onClick={() => deleteOrgMutation.mutate({ id: org.id }, { onSuccess: () => refetchOrganizers() })}>Remove</button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Games Management */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <h4 style={{ margin: 0 }}>Matches & Scoreboards</h4>
                                            <button style={styles.primaryBtn} onClick={() => {
                                                const title = prompt('Match Title (e.g., Team A vs Team B):');
                                                if (title) createGameMutation.mutate({ data: { title, public: true, scoreDetails: '0 - 0' } }, { onSuccess: () => refetchTenantGames() });
                                            }}>+ Create Match</button>
                                        </div>
                                        {Array.isArray(tenantGames?.data) && tenantGames?.data.map((g: any) => (
                                            <div key={g.id} style={styles.listRow}>
                                                <span><strong>{g.title}</strong> • Score: {g.scoreDetails} ({g.public ? 'Public' : 'Private'})</span>
                                                <button style={styles.dangerBtn} onClick={() => deleteGameMutation.mutate({ id: g.id }, { onSuccess: () => refetchTenantGames() })}>Delete</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {normalizedRole === 'ORGANIZER' && (
                                <div style={styles.card}>
                                    <div style={styles.sectionHeader}>
                                        <h3 style={styles.sectionTitle}>Live Scorekeeper Console</h3>
                                        <button style={styles.secondaryBtn} onClick={() => refetchOrganizerGames()}>Load Matches</button>
                                    </div>
                                    {Array.isArray(organizerGames?.data) && organizerGames?.data.map((g: any) => (
                                        <div key={g.id} style={styles.listRow}>
                                            <span><strong>{g.title}</strong> — Current: {g.scoreDetails}</span>
                                            <button style={styles.primaryBtn} onClick={() => {
                                                const newScore = prompt('Enter updated score:', g.scoreDetails);
                                                const isPub = confirm('Publish score to public homepage?');
                                                if (newScore !== null) {
                                                    updateScoreMutation.mutate(
                                                        { id: g.id, data: { scoreDetails: newScore, public: isPub } },
                                                        { onSuccess: () => refetchOrganizerGames() }
                                                    );
                                                }
                                            }}>Update Score</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 3: SUPER ADMIN CONSOLE */}
            {activeView === 'SUPER_ADMIN' && normalizedRole === 'SUPER_ADMIN' && (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Platform Super Admin</h3>
                            <button style={styles.secondaryBtn} onClick={() => { refetchAllTenants(); refetchPendingTenants(); }}>Refresh</button>
                        </div>
                        <h4>Pending Approvals</h4>
                        {Array.isArray(pendingTenants?.data) && pendingTenants?.data.map((t: any) => (
                            <div key={t.id} style={styles.listRow}>
                                <span>{t.name} ({t.tier})</span>
                                <button style={styles.successBtn} onClick={() => approveTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchPendingTenants(); refetchAllTenants(); fetchPublicTenants(); } })}>
                                    Approve Organization
                                </button>
                            </div>
                        ))}
                        <h4 style={{ marginTop: '24px' }}>All Registered Tenants</h4>
                        {Array.isArray(allTenants?.data) && allTenants?.data.map((t: any) => (
                            <div key={t.id} style={styles.listRow}>
                                <span>{t.name} ({t.tier}) — <strong>{t.status}</strong></span>
                                <button style={styles.dangerBtn} onClick={() => deleteTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchAllTenants(); fetchPublicTenants(); } })}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    page: { fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' },
    navbar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 10 },
    navInner: { maxWidth: '1140px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brand: { fontSize: '20px', fontWeight: 800, color: '#1e293b', cursor: 'pointer' },
    hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff', padding: '72px 24px', marginBottom: '40px' },
    heroPill: { backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' },
    heroTitle: { fontSize: '42px', fontWeight: 800, maxWidth: '720px', margin: '16px 0', lineHeight: 1.15 },
    heroSubtitle: { fontSize: '18px', color: '#cbd5e1', maxWidth: '620px', lineHeight: 1.6, marginBottom: '28px' },
    heroActions: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
    heroPrimaryBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' },
    heroSecondaryBtn: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '15px' },
    container: { maxWidth: '1140px', margin: '0 auto', padding: '0 24px 60px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    sectionTitle: { fontSize: '22px', fontWeight: 700, margin: 0 },
    sectionSub: { fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' },
    gridCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', cursor: 'pointer', transition: 'transform 0.15s', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
    scoreCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' },
    cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    tierBadge: { backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' },
    tenantIdTag: { fontSize: '12px', color: '#94a3b8' },
    gridCardTitle: { fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' },
    gridCardDesc: { fontSize: '14px', color: '#2563eb', fontWeight: 500, margin: 0 },
    liveIndicator: { fontSize: '11px', fontWeight: 700, color: '#16a34a', marginBottom: '8px' },
    scoreBox: { backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '12px' },
    tenantBanner: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', margin: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    card: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' },
    primaryBtn: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' },
    secondaryBtn: { backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' },
    dangerBtn: { backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' },
    successBtn: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' },
    listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }
};

export default AppDashboard;