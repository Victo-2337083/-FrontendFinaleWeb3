import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
plugins: [
    react(),
    tailwindcss(),
    VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
        enabled: true,
    },
    includeAssets: ['favicon.ico', 'logo192.png', 'vite.svg'],
    manifest: {
        name: 'Depan-Heure',
        short_name: 'dep',
        description: 'Le meilleur dépanneur en ligne',
        theme_color: '#ffffff',
        icons: [
        {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
        },
        {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
        },
        ],
    },
    }),
],
});