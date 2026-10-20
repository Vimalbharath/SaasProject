import axios from 'axios';

// Automatically inject the active tenant header into every request
axios.interceptors.request.use((config) => {
    const activeTenantId = localStorage.getItem('activeTenantId') || '1'; // Default to tenant 1 for demo
    config.headers['X-Tenant-ID'] = activeTenantId;
    return config;
});