import React, { useEffect, useRef, useState } from 'react';
import { dashboardStyles as styles } from '../../styles/dashboardStyles';

interface BannerItem {
    id: string;
    step: string;
    title: string;
    description: string;
    direction: 'left' | 'right';
}

const BANNERS: BannerItem[] = [
    {
        id: 'step-1',
        step: 'STEP 01 • ONBOARD',
        title: 'Register Your Club & Get Approved',
        description: 'Submit your organization name, tier, and admin credentials. Once approved, your dedicated portal appears in the directory.',
        direction: 'left',
    },
    {
        id: 'step-2',
        step: 'STEP 02 • ORGANIZE',
        title: 'Schedule Matches, Add Organizers & Invite Players',
        description: 'Tenant admins create games, set match timings and venues, assign scorekeepers, and share a player registration link.',
        direction: 'right',
    },
    {
        id: 'step-3',
        step: 'STEP 03 • BROADCAST',
        title: 'Update Live Scores & Toggle Public Visibility',
        description: 'Organizers post live score updates from the field and flip matches between Private and Public for the live scoreboard.',
        direction: 'left',
    },
];

const AnimatedBannerCard: React.FC<{ item: BannerItem }> = ({ item }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const hiddenOffset = item.direction === 'left' ? 'translateX(-48px)' : 'translateX(48px)';

    return (
        <div
            ref={ref}
            style={{
                ...styles.card,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                borderLeft: item.direction === 'left' ? '5px solid #2563eb' : '1px solid #e2e8f0',
                borderRight: item.direction === 'right' ? '5px solid #16a34a' : '1px solid #e2e8f0',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : hiddenOffset,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
        >
            <div>
                <span style={styles.tierBadge}>{item.step}</span>
                <h3 style={{ ...styles.gridCardTitle, marginTop: '10px' }}>{item.title}</h3>
                <p style={styles.sectionSub}>{item.description}</p>
            </div>
        </div>
    );
};

export const ScrollFeatureBanners: React.FC = () => (
    <section style={{ marginBottom: '48px' }}>
        <div style={styles.sectionHeader}>
            <div>
                <h2 style={styles.sectionTitle}>How the Platform Works</h2>
                <p style={styles.sectionSub}>Scroll through the workflow from club onboarding to live match updates.</p>
            </div>
        </div>
        {BANNERS.map((banner) => (
            <AnimatedBannerCard key={banner.id} item={banner} />
        ))}
    </section>
);