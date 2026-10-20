import React, { useState } from 'react';
import { useGetOrganizers, useCreateOrganizer, useDeleteOrganizer } from '@saas/api-client';

function OrgAdminDashboard() {
    const [tenantId, setTenantId] = useState('1');

    // Save tenant ID to localStorage so the interceptor picks it up
    const handleTenantSwitch = (id: string) => {
        setTenantId(id);
        localStorage.setItem('activeTenantId', id);
    };

    const { data: organizers, isLoading, refetch } = useGetOrganizers();
    const createOrgMutation = useCreateOrganizer();
    const deleteOrgMutation = useDeleteOrganizer();

    const handleAddOrganizer = () => {
        const name = prompt("Organizer Name:");
        const email = prompt("Organizer Email:");
        if (name && email) {
            createOrgMutation.mutate(
                { data: { name, email } },
                { onSuccess: () => refetch() }
            );
        }
    };

    const handleDeleteOrganizer = (id: number) => {
        if (confirm("Remove this organizer from your organization?")) {
            deleteOrgMutation.mutate({ id }, { onSuccess: () => refetch() });
        }
    };

    if (isLoading) return <p>Loading organization team...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Organization Admin Portal</h2>

            Tenant Switcher Simulation
            <div style={{ marginBottom: 15 }}>
                <label>Active Tenant ID: </label>
                <select value={tenantId} onChange={(e) => handleTenantSwitch(e.target.value)}>
                    <option value="1">Tenant A (ID: 1)</option>
                    <option value="2">Tenant B (ID: 2)</option>
                </select>
            </div>

            <button onClick={handleAddOrganizer}>Add Organizer</button>

            <ul>
                {Array.isArray(organizers?.data) && organizers?.data.map((org: any) => (
                    <li key={org.id} style={{ margin: '8px 0' }}>
                        {org.name} ({org.email}) {' '}
                        <button onClick={() => handleDeleteOrganizer(org.id)} style={{ color: 'red' }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrgAdminDashboard;