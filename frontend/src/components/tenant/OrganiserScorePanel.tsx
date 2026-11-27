import React from 'react';
import { useGetGames, useUpdateGameScore, useToggleGameVisibility } from '@saas/api-client';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface Props {
    onScoreOrVisibilityChange: () => void;
}

export const OrganizerScorePanel: React.FC<Props> = ({ onScoreOrVisibilityChange }) => {
    const { data: organizerGames, refetch: refetchOrganizerGames } = useGetGames();
    const updateScoreMutation = useUpdateGameScore();
    const toggleVisibilityMutation = useToggleGameVisibility();

    return (
        <div style={styles.card}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Live Scorekeeper Console</h3>
                <button style={styles.secondaryBtn} onClick={() => refetchOrganizerGames()}>
                    Load Matches
                </button>
            </div>
            {Array.isArray(organizerGames?.data) &&
                organizerGames?.data.map((g: any) => {
                    const isGamePublic = Boolean(g.isPublic ?? g.public);
                    return (
                        <div key={g.id} style={styles.listRow}>
                            <div>
                                <strong>{g.title}</strong> — Current: {g.scoreDetails}{' '}
                                <span style={styles.badge}>{isGamePublic ? 'Public' : 'Private'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    style={styles.primaryBtn}
                                    onClick={() => {
                                        const newScore = prompt('Enter updated score:', g.scoreDetails);
                                        if (newScore !== null) {
                                            updateScoreMutation.mutate(
                                                { id: g.id, data: { scoreDetails: newScore, public: isGamePublic } },
                                                {
                                                    onSuccess: () => {
                                                        refetchOrganizerGames();
                                                        onScoreOrVisibilityChange();
                                                    },
                                                }
                                            );
                                        }
                                    }}
                                >
                                    Update Score
                                </button>
                                <button
                                    style={isGamePublic ? styles.secondaryBtn : styles.successBtn}
                                    onClick={() =>
                                        toggleVisibilityMutation.mutate(
                                            { id: g.id },
                                            {
                                                onSuccess: () => {
                                                    refetchOrganizerGames();
                                                    onScoreOrVisibilityChange();
                                                },
                                            }
                                        )
                                    }
                                >
                                    {isGamePublic ? 'Make Private' : 'Make Public'}
                                </button>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};