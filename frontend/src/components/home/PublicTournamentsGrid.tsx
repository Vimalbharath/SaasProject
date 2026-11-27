import React from 'react';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    tournaments: any;
    onRefresh: () => void;
}

export const PublicTournamentsGrid: React.FC<Props> = ({ tournaments, onRefresh }) => (
    <section id="live-scores">
        <div style={styles.sectionHeader}>
            <div>
                <h2 style={styles.sectionTitle}>Public Tournaments</h2>
                <p style={styles.sectionSub}>Real-time scores published across all active organizations.</p>
            </div>
            <button style={styles.secondaryBtn} onClick={onRefresh}>
                Refresh Scores
            </button>
        </div>

        <div style={styles.grid}>
            {Array.isArray(tournaments) &&
                tournaments.map((tournament: any) => (
                    <div key={tournament.id} style={styles.scoreCard}>
                        <div style={styles.liveIndicator}>● LIVE / PUBLIC</div>
                        <h3 style={styles.gridCardTitle}>{tournament.title}</h3>
                        <div style={styles.scoreBox}>{tournament.scoreDetails || 'Match Scheduled'}</div>
                    </div>
                ))}
        </div>
    </section>
);