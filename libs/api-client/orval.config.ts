import { defineConfig } from 'orval';

export default defineConfig({
    saasApi: {
        input: 'http://localhost:8080/v3/api-docs', // Spring Boot OpenAPI endpoint
        output: {
            mode: 'tags-split',
            target: './src/generated/endpoints',
            schemas: './src/generated/models',
            client: 'react-query',
            mock: false,
        },
    },
});