import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'start-backend',
      configureServer(server) {
        // Spawn the Express backend in the background
        const backend = spawn('node', [path.resolve(__dirname, 'server.js')], {
          stdio: 'inherit',
          shell: true
        });
        
        // Ensure the backend process is killed when Vite exits
        server.httpServer.on('close', () => {
          backend.kill();
        });
        
        process.on('exit', () => {
          backend.kill();
        });
      }
    }
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
