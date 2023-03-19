import { defineConfig } from "vite";
import VitePluginVue from "@vitejs/plugin-vue";
import VitePluginSSR from "vite-plugin-ssr/plugin";
import topLevelAwait from "vite-plugin-top-level-await"


export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  plugins: [
    VitePluginVue(),
    VitePluginSSR({ prerender: true }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
  ]
});
