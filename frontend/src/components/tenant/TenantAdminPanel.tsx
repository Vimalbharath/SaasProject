import React, { useState } from 'react';
import {
    useGetOrganizers,
    useAddOrganizer,
    useDeleteOrganizer,
    useGetTenantGames,
    useCreateGame,
    useDeleteGame,
    useGetTenantTournaments,
    useCreateTournament,
    useDeleteTournament,
} from '@saas/api-client';
import { useAuth } from '../../context/AuthContext';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface ScheduledMatch {
    id: string;
    matchTitle: string;
    dateTime: string;
    venue: string;
}

export const TenantAdminPanel: React.FC = () => {
    const { tenantId, selectedTenant } = useAuth();
    const { data: organizers, refetch: refetchOrganizers } = useGetOrganizers();
    const addOrgMutation = useAddOrganizer();
    const deleteOrgMutation = useDeleteOrganizer();

    const { data: tenantGames, refetch: refetchTenantGames } = useGetTenantGames();
    const createGameMutation = useCreateGame();
    const deleteGameMutation = useDeleteGame();

    const { data: tenantTournaments, refetch: refetchTenantTournaments } = useGetTenantTournaments();
    const createTournamentMutation = useCreateTournament();
    const deleteTournamentMutation = useDeleteTournament();

    // Match Schedule state (keyed by tenantId)
    const [schedulesByTenant, setSchedulesByTenant] = useState<Record<string, ScheduledMatch[]>>({});
    const [matchTitle, setMatchTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [venue, setVenue] = useState('');

    // Player Registration Link state
    const [playerInviteLink, setPlayerInviteLink] = useState('');
    const [copied, setCopied] = useState(false);

    const currentSchedules = schedulesByTenant[tenantId] || [];

    const handleAddSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matchTitle.trim() || !dateTime || !venue.trim()) return;
        const newEntry: ScheduledMatch = {
            id: crypto.randomUUID(),
            matchTitle: matchTitle.trim(),
            dateTime,
            venue: venue.trim(),
        };
        setSchedulesByTenant((prev) => ({
            ...prev,
            [tenantId]: [...(prev[tenantId] || []), newEntry],
        }));
        setMatchTitle('');
        setDateTime('');
        setVenue('');
    };

    const handleGeneratePlayerLink = () => {
        const slug = encodeURIComponent(selectedTenant?.name || 'club');
        const link = `${window.location.origin}/register-player?tenantId=${tenantId}&club=${slug}`;
        setPlayerInviteLink(link);
        setCopied(false);
    };

    const handleCopyLink = async () => {
        if (!playerInviteLink) return;
        await navigator.clipboard.writeText(playerInviteLink);
        setCopied(true);
    };

    return (
        <div style={styles.card}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Workspace Administration</h3>
                <button
                    style={styles.secondaryBtn}
                    onClick={() => {
                        refetchOrganizers();
                        refetchTenantGames();
                    }}
                >
                    Sync Workspace Data
                </button>
            </div>

            {/* Organizers */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0 }}>Staff & Organizers</h4>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => {
                            const u = prompt('New Organizer Username:');
                            const p = prompt('New Organizer Password:');
                            if (u && p) {
                                addOrgMutation.mutate(
                                    { data: { username: u, password: p } },
                                    { onSuccess: () => refetchOrganizers() }
                                );
                            }
                        }}
                    >
                        + Add Organizer
                    </button>
                </div>
                {Array.isArray(organizers?.data) &&
                    organizers?.data.map((org: any) => (
                        <div key={org.id} style={styles.listRow}>
                            <span>
                                <strong>{org.username}</strong> ({org.role})
                            </span>
                            <button
                                style={styles.dangerBtn}
                                onClick={() =>
                                    deleteOrgMutation.mutate({ id: org.id }, { onSuccess: () => refetchOrganizers() })
                                }
                            >
                                Remove
                            </button>
                        </div>
                    ))}
            </div>

            {/* Games / Matches */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0 }}>Games & Scoreboards</h4>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => {
                            const title = prompt('Game / Match Title (e.g., Team A vs Team B):');
                            if (title) {
                                createGameMutation.mutate(
                                    { data: { title, public: true, scoreDetails: '0 - 0' } },
                                    { onSuccess: () => refetchTenantGames() }
                                );
                            }
                        }}
                    >
                        + Add Game
                    </button>
                </div>
                {Array.isArray(tenantGames?.data) &&
                    tenantGames?.data.map((g: any) => (
                        <div key={g.id} style={styles.listRow}>
                            <span>
                                <strong>{g.title}</strong> • Score: {g.scoreDetails} (
                                {Boolean(g.isPublic ?? g.public) ? 'Public' : 'Private'})
                            </span>
                            <button
                                style={styles.dangerBtn}
                                onClick={() =>
                                    deleteGameMutation.mutate({ id: g.id }, { onSuccess: () => refetchTenantGames() })
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
            </div>

            {/* Games / Matches */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0 }}>Tournaments</h4>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => {
                            const title = prompt('Game / Match Title (e.g., Team A vs Team B):');
                            if (title) {
                                createTournamentMutation.mutate(
                                    { data: { title, public: true } },
                                    { onSuccess: () => refetchTenantTournaments() }
                                );
                            }
                        }}
                    >
                        + Add Tournament
                    </button>
                </div>
                {Array.isArray(tenantTournaments?.data) &&
                    tenantTournaments?.data.map((g: any) => (
                        <div key={g.id} style={styles.listRow}>
                            <span>
                                <strong>{g.title}</strong> • Score: { } (
                                {Boolean(g.isPublic ?? g.public) ? 'Public' : 'Private'})
                            </span>
                            <button
                                style={styles.dangerBtn}
                                onClick={() =>
                                    deleteTournamentMutation.mutate({ id: g.id }, { onSuccess: () => refetchTenantTournaments() })
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
            </div>

            {/* Match Schedule */}
            <div style={{ marginBottom: '28px' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>Match Schedule</h4>
                <form onSubmit={handleAddSchedule} style={styles.formGrid}>
                    <div>
                        <label style={styles.label}>Match Title</label>
                        <input
                            style={styles.input}
                            placeholder="e.g., Lions vs Tigers"
                            value={matchTitle}
                            onChange={(e) => setMatchTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={styles.label}>Date & Time</label>
                        <input
                            type="datetime-local"
                            style={styles.input}
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={styles.label}>Venue</label>
                        <input
                            style={styles.input}
                            placeholder="e.g., Ground 1"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" style={styles.primaryBtn}>
                            + Add Schedule
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '14px' }}>
                    {currentSchedules.map((item) => (
                        <div key={item.id} style={styles.listRow}>
                            <span>
                                <strong>{item.matchTitle}</strong> • {new Date(item.dateTime).toLocaleString()} • {item.venue}
                            </span>
                            <button
                                style={styles.dangerBtn}
                                onClick={() =>
                                    setSchedulesByTenant((prev) => ({
                                        ...prev,
                                        [tenantId]: (prev[tenantId] || []).filter((s) => s.id !== item.id),
                                    }))
                                }
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Generate Register Players Link */}
            <div>
                <h4 style={{ margin: '0 0 10px 0' }}>Player Registration Link</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button style={styles.successBtn} onClick={handleGeneratePlayerLink}>
                        Generate Register Players Link
                    </button>
                    {playerInviteLink && (
                        <>
                            <input
                                readOnly
                                value={playerInviteLink}
                                style={{ ...styles.input, maxWidth: '460px', backgroundColor: '#f8fafc' }}
                            />
                            <button style={styles.secondaryBtn} onClick={handleCopyLink}>
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};