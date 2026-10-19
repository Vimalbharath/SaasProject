import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTenants, useCreateTenant } from '@saas/api-client';

const queryClient = new QueryClient();

function TenantApp() {
    const { data: tenants, isLoading, refetch } = useGetTenants();
    const createTenantMutation = useCreateTenant();

    const handleAddTenant = () => {
        const name = prompt('Enter Tenant Name:');
        if (name) {
            createTenantMutation.mutate(
                { data: { name } },
                { onSuccess: () => refetch() }
            );
        }
    };

    if (isLoading) return <p>Loading tenants...</p>;

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h2>Tenant List (1-Table Stack Test)</h2>
            <button onClick={handleAddTenant}>Add Tenant</button>
            <ul>
                {Array.isArray(tenants?.data) && tenants?.data?.map((t: any) => (
                    <li key={t.id}>
                        <strong>ID:</strong> {t.id} | <strong>Name:</strong> {t.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <TenantApp />
        </QueryClientProvider>
    </React.StrictMode>
);