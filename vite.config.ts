import process from "node:process"
import { defineConfig, type Plugin, type PluginOption } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

const nodeMajor = Number(process.versions.node.split(".")[0])
const enablePwa = nodeMajor >= 20

function stubPwaRegister(): Plugin {
  return {
    name: "stub-pwa-register",
    resolveId(id) {
      if (id === "virtual:pwa-register") return "\0virtual:pwa-register"
    },
    load(id) {
      if (id === "\0virtual:pwa-register") {
        return "export function registerSW() { return () => {} }"
      }
    },
  }
}

const pwaPlugin: PluginOption = enablePwa
  ? VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Custom Açaí — Monte seu pedido",
        short_name: "Custom Açaí",
        description: "Monte seu açaí e envie o pedido pelo WhatsApp",
        theme_color: "#7e22ce",
        background_color: "#faf5ff",
        display: "standalone",
        lang: "pt-BR",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    })
  : stubPwaRegister()

export default defineConfig({
  plugins: [react(), pwaPlugin],
  server: {
    port: 5173,
    host: true,
    open: true,
  },
})
