import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get the DFX network from the environment variable or default to 'local'
const dfxNetwork = process.env.DFX_NETWORK || 'local';

// Get the DFX port from the environment variable or default to 4943
const dfxPort = process.env.DFX_PORT || 4943;

// Get the canister ID from the environment variable or default to 'ticket_system_backend'
const canisterId = process.env.CANISTER_ID_TICKET_SYSTEM_BACKEND || 'ticket_system_backend';

// Get the host from the environment variable or default to 'localhost'
const host = process.env.DFX_HOST || 'localhost';

// Generate canister declarations directory if it doesn't exist
const declarationsDir = path.resolve(__dirname, 'src/declarations');
if (!fs.existsSync(declarationsDir)) {
  fs.mkdirSync(declarationsDir, { recursive: true });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://${host}:${dfxPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, `/api/${canisterId}`)
      }
    },
    port: 3000,
    strictPort: true,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    // Define environment variables for the frontend
    'process.env.TICKET_SYSTEM_BACKEND_CANISTER_ID': JSON.stringify(canisterId),
    'process.env.DFX_NETWORK': JSON.stringify(dfxNetwork)
  }
});
