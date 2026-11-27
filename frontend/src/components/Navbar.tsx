import React from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardStyles as styles } from '../styles/dashboardStyles';

export const Navbar: React.FC = () => {
    const {
        token,
        normalizedRole,
        activeView,
        showRegisterModal,
        setShowRegisterModal,
        setActiveView,
        goHome,
        logout,
    } = useAuth();

    return (
        <nav style={styles.navbar}>
            <div style={styles.navInner}>
                <span style={styles.brand} onClick={goHome}>
                    🏆 ArenaFlow SaaS
                </span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {activeView !== 'HOME' && (
                        <button style={styles.secondaryBtn} onClick={goHome}>
                            ← Back to Directory
                        </button>
                    )}
                    {normalizedRole === 'SUPER_ADMIN' && (
                        <button style={styles.secondaryBtn} onClick={() => setActiveView('SUPER_ADMIN')}>
                            Super Admin Console
                        </button>
                    )}
                    {!token ? (
                        <button
                            style={styles.primaryBtn}
                            onClick={() => setShowRegisterModal(!showRegisterModal)}
                        >
                            + Register Organization
                        </button>
                    ) : (
                        <button style={styles.dangerBtn} onClick={logout}>
                            Log Out ({normalizedRole})
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};