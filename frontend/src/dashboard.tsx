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
    const [tenantId, setTenantId] = useState(localStorage.getItem('activeTenantId') || '1');

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

    const handleTenantSwitch = (id: string) => {
        setTenantId(id);
        localStorage.setItem('activeTenantId', id);
    };

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
                        handleTenantSwitch(data.tenantId.toString());
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
                    refetchAllTenants();
                    refetchPendingTenants();
                },
                onError: (err) => alert('Registration failed: ' + err.message)
            }
        );
    };

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
            <h1>Sports SaaS Platform Dashboard</h1>

            {/* Session Bar */}
            <div style={{ background: '#f0f0f0', padding: 10, marginBottom: 20, borderRadius: 5 }}>
                <h3>Session & Tenant Control</h3>
                <p>Role: {role || 'Guest'} | Token: {token ? 'Active' : 'None'}</p>
                <label>Active Tenant ID (X-Tenant-ID): </label>
                <select value={tenantId} onChange={(e) => handleTenantSwitch(e.target.value)}>
                    <option value="1">Tenant 1</option>
                    <option value="2">Tenant 2</option>
                </select>
                {token && (
                    <button style={{ marginLeft: 15 }} onClick={() => {
                        localStorage.clear();
                        setToken('');
                        setRole('');
                        window.location.reload();
                    }}>Log Out</button>
                )}
            </div>

            {/* Login Section */}
            {!token && (
                <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                    <h3>Login</h3>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Username: </label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div style={{ marginTop: 5 }}>
                            <label>Password: </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" style={{ marginTop: 10 }}>Login</button>
                    </form>
                </div>
            )}

            {/* Public Registration Section */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                <h3>Register Tenant (Public)</h3>
                <form onSubmit={handleRegister}>
                    <div><label>Organization Name: </label><input value={regOrgName} onChange={(e) => setRegOrgName(e.target.value)} /></div>
                    <div><label>Tier: </label><input value={regTier} onChange={(e) => setRegTier(e.target.value)} /></div>
                    <div><label>Admin Username: </label><input value={regUser} onChange={(e) => setRegUser(e.target.value)} /></div>
                    <div><label>Admin Password: </label><input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} /></div>
                    <button type="submit" style={{ marginTop: 10 }}>Register Tenant</button>
                </form>
            </div>

            {/* Public Games */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                <h3>Public Games</h3>
                <button onClick={() => refetchPublicGames()}>Refresh Public Games</button>
                <ul>
                    {Array.isArray(publicGames?.data) && publicGames.data.map((g: any) => (
                        <li key={g.id}>{g.title} - Score: {g.scoreDetails || 'N/A'}</li>
                    ))}
                </ul>
            </div>

            {/* Super Admin Section */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                <h3>Super Admin Portal</h3>
                <button onClick={() => { refetchAllTenants(); refetchPendingTenants(); }}>Load Tenants</button>
                <h4>Pending Tenants</h4>
                <ul>
                    {Array.isArray(pendingTenants?.data) && pendingTenants.data.map((t: any) => (
                        <li key={t.id}>
                            {t.name} ({t.tier}) - Status: {t.status}
                            <button style={{ marginLeft: 10 }} onClick={() => approveTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchPendingTenants(); refetchAllTenants(); } })}>Approve</button>
                        </li>
                    ))}
                </ul>
                <h4>All Tenants</h4>
                <ul>
                    {Array.isArray(allTenants?.data) && allTenants.data.map((t: any) => (
                        <li key={t.id}>
                            {t.name} ({t.tier}) - Status: {t.status}
                            <button style={{ marginLeft: 10, color: 'red' }} onClick={() => deleteTenantMutation.mutate({ id: t.id }, { onSuccess: () => { refetchAllTenants(); } })}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tenant Admin Section */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                <h3>Tenant Admin Portal (Tenant ID: {tenantId})</h3>
                <button onClick={() => { refetchOrganizers(); refetchTenantGames(); }}>Load Tenant Data</button>
                
                <h4>Organizers</h4>
                <button onClick={() => {
                    const u = prompt("Organizer username:");
                    const p = prompt("Organizer password:");
                    if (u && p) addOrgMutation.mutate({ data: { username: u, password: p } }, { onSuccess: () => refetchOrganizers() });
                }}>Add Organizer</button>
                <ul>
                    {Array.isArray(organizers?.data) && organizers.data.map((org: any) => (
                        <li key={org.id}>
                            {org.username} (Role: {org.role})
                            <button style={{ marginLeft: 10, color: 'red' }} onClick={() => deleteOrgMutation.mutate({ id: org.id }, { onSuccess: () => refetchOrganizers() })}>Delete</button>
                        </li>
                    ))}
                </ul>

                <h4>Tenant Games</h4>
                <button onClick={() => {
                    const title = prompt("Game Title:");
                    if (title) createGameMutation.mutate({ data: { title, public: true, scoreDetails: '0-0' } }, { onSuccess: () => refetchTenantGames() });
                }}>Create Game</button>
                <ul>
                    {Array.isArray(tenantGames?.data) && tenantGames.data.map((g: any) => (
                        <li key={g.id}>
                            {g.title} [{g.public ? 'Public' : 'Private'}] - {g.scoreDetails}
                            <button style={{ marginLeft: 10, color: 'red' }} onClick={() => deleteGameMutation.mutate({ id: g.id }, { onSuccess: () => refetchTenantGames() })}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Organizer Section */}
            <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 5 }}>
                <h3>Organizer Portal</h3>
                <button onClick={() => refetchOrganizerGames()}>Load Assigned Games</button>
                <ul>
                    {Array.isArray(organizerGames?.data) && organizerGames.data.map((g: any) => (
                        <li key={g.id} style={{ margin: '10px 0' }}>
                            {g.title} - Score: {g.scoreDetails}
                            <button style={{ marginLeft: 10 }} onClick={() => {
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
        </div>
    );
}

export default AppDashboard;
