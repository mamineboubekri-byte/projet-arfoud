// Fichier: frontend/vite.config.js (Contenu entier)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🚨 CORRECTION CRITIQUE: DEDUPLICATION DE REACT
  // Ceci force Vite à n'utiliser qu'une seule instance de React et React-DOM,
  // ce qui résout le problème des 'Invalid hook call' ou des 'Cannot read properties of null (reading 'useState')' 
  // causés par des dépendances (comme react-toastify) qui chargent une copie dupliquée.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  
  // Configuration pour le proxy si nécessaire (non requis pour cette erreur)
  server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:5000', // Votre backend Node.js
            changeOrigin: true,
            secure: false,
        }
    }
  }
});