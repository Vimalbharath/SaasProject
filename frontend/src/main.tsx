import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useGetTenants,
    useCreateTenant,
    useUpdateTenant,
    useDeleteTenant
} from '@saas/api-client';

const queryClient = new QueryClient();

function TenantApp() {
    const { data: tenants, isLoading, refetch } = useGetTenants();
    const createMutation = useCreateTenant();
    const updateMutation = useUpdateTenant();
    const deleteMutation = useDeleteTenant();

    // Create
    const handleAdd = () => {
        const name = prompt('Enter Tenant Name:');
        if (name) {
            createMutation.mutate({ data: { name } }, { onSuccess: () => refetch() });
        }
    };

    // Update
    const handleEdit = (id: number, currentName: string) => {
        const name = prompt('Update Tenant Name:', currentName);
        if (name) {
            updateMutation.mutate({ id, data: { name } }, { onSuccess: () => refetch() });
        }
    };

    // Delete
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tenant?')) {
            deleteMutation.mutate({ id }, { onSuccess: () => refetch() });
        }
    };

    if (isLoading) return <p>Loading tenants...</p>;

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h2>SaaS Tenant Management (Full CRUD)</h2>
            <button onClick={handleAdd}>Add Tenant</button>
            <ul>
                {Array.isArray(tenants?.data) && tenants?.data.map((t: any) => (
                    <li key={t.id} style={{ margin: '10px 0' }}>
                        <strong>ID:</strong> {t.id} | <strong>Name:</strong> {t.name} {' '}
                        <button onClick={() => handleEdit(t.id, t.name)}>Edit</button>{' '}
                        <button onClick={() => handleDelete(t.id)} style={{ color: 'red' }}>Delete</button>
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