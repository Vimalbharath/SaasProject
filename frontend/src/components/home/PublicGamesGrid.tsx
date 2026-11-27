import React from 'react';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    games: any;
    onRefresh: () => void;
}

export const PublicGamesGrid: React.FC<Props> = ({ games, onRefresh }) => (
    <section id="live-scores">
        <div style={styles.sectionHeader}>
            <div>
                <h2 style={styles.sectionTitle}>Live Public Scoreboard</h2>
                <p style={styles.sectionSub}>Real-time scores published across all active organizations.</p>
            </div>
            <button style={styles.secondaryBtn} onClick={onRefresh}>
                Refresh Scores
            </button>
        </div>

        <div style={styles.grid}>
            {Array.isArray(games) &&
                games.map((game: any) => (
                    <div key={game.id} style={styles.scoreCard}>
                        <div style={styles.liveIndicator}>● LIVE / PUBLIC</div>
                        <h3 style={styles.gridCardTitle}>{game.title}</h3>
                        <div style={styles.scoreBox}>{game.scoreDetails || 'Match Scheduled'}</div>
                    </div>
                ))}
        </div>
    </section>
);