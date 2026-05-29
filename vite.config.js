// Vite configuration — Svelte + TypeScript + Tailwind + PWA (service worker with auto-update)
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
    VitePWA({
      // Auto-update service worker without prompting the user
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "pwa.svg"],
      manifest: {
        name: "Dev Cheatsheets",
        short_name: "Cheatsheets",
        description: "Offline personal database for developer cheatsheets.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  // Expose dev server on all network interfaces for Docker/ LAN access
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    host: true,
    port: 8080,
  },
  publicDir: "public",
});
