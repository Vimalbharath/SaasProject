import React, { useState } from 'react';
import { useRegisterTenant } from '@saas/api-client';
import { TenantItem, useAuth } from '../../context/AuthContext';
import { ScrollFeatureBanners } from './ScrollFeatureBanners';
import { TenantDirectoryGrid } from './TenantDirectoryGrid';
import { PublicGamesGrid } from './PublicGamesGrid';
import { PublicTournamentsGrid } from './PublicTournamentsGrid';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    publicTenants: TenantItem[];
    onRefreshTenants: () => void;
    publicGames: any;
    onRefreshGames: () => void;
    publicTournaments: any;
    onRefreshTournaments: () => void;
}

export const HomeView: React.FC<Props> = ({
    publicTenants,
    onRefreshTenants,
    publicGames,
    onRefreshGames,
    publicTournaments,
    onRefreshTournaments
}) => {
    const { showRegisterModal, setShowRegisterModal } = useAuth();
    const [regOrgName, setRegOrgName] = useState('');
    const [regTier, setRegTier] = useState('FREE');
    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');
    const registerMutation = useRegisterTenant();

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
                onError: (err: any) => alert('Registration failed: ' + (err.response?.data || err.message)),
            }
        );
    };

    return (
        <div>
            <section style={styles.hero}>
                <div style={styles.container}>
                    <span style={styles.heroPill}>MULTI-TENANT TOURNAMENT ENGINE</span>
                    <h1 style={styles.heroTitle}>Run Leagues, Live Scoreboards & Clubs in One Place.</h1>
                    <p style={styles.heroSubtitle}>
                        Launch an isolated workspace for your sports club, assign match organizers, and broadcast
                        real-time scores to fans everywhere.
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
                {showRegisterModal && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={styles.sectionTitle}>Create New Organization Workspace</h3>
                            <button style={styles.secondaryBtn} onClick={() => setShowRegisterModal(false)}>
                                Close
                            </button>
                        </div>
                        <form onSubmit={handleRegister} style={styles.formGrid}>
                            <div>
                                <label style={styles.label}>Organization / Club Name</label>
                                <input
                                    style={styles.input}
                                    placeholder="e.g., Chennai Super Strikers"
                                    value={regOrgName}
                                    onChange={(e) => setRegOrgName(e.target.value)}
                                    required
                                />
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
                                <input
                                    style={styles.input}
                                    value={regUser}
                                    onChange={(e) => setRegUser(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Admin Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={regPass}
                                    onChange={(e) => setRegPass(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <button type="submit" style={styles.primaryBtn}>
                                    Submit Registration
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <ScrollFeatureBanners />
                <TenantDirectoryGrid tenants={publicTenants} onRefresh={onRefreshTenants} />
                <PublicGamesGrid games={publicGames} onRefresh={onRefreshGames} />
                <PublicTournamentsGrid tournaments={publicTournaments} onRefresh={onRefreshTournaments} />
            </div>
        </div>
    );
};