import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png"],
      manifest: {
<<<<<<< HEAD
        name: "GPS Tracker",
        short_name: "GPS Tracker",
        description: "Real-time GPS tracking with speedometer",
=======
        name: "GPS Raw - Real-time Speed & Location",
        short_name: "GPS Raw",
        description:
          "Real-time GPS tracking with speedometer, altitude, and position accuracy monitoring",
>>>>>>> eb3d23f (Refactor and simplify)
        theme_color: "#0a0f1a",
        background_color: "#0a0f1a",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/placeholder.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/placeholder.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
