// Fichier: frontend/src/app/store.js (Mise à jour pour inclure authReducer)

import { configureStore } from '@reduxjs/toolkit';
// Import du reducer d'authentification
import authReducer from '../features/auth/authSlice'; // <-- NOUVEL IMPORT

export const store = configureStore({
    reducer: {
        // Remplacement du reducer temporaire par le reducer d'authentification
        auth: authReducer, // <-- MODIFICATION MAJEURE
    },
});