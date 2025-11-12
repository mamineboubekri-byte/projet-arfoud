// Fichier: frontend/src/features/auth/authSlice.js (NOUVEAU FICHIER)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Vérification du localStorage pour l'utilisateur
// Nous allons retirer la logique de localStorage des autres composants et la centraliser ici
const client = JSON.parse(localStorage.getItem('client'));

// État initial du slice
const initialState = {
    client: client ? client : null, // client est chargé si trouvé dans localStorage
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// ======================================================================
// 1. ASYNC THUNKS (Fonctions pour les appels API)
// ======================================================================

// --- Enregistrement (Inscription) ---
export const register = createAsyncThunk(
    'auth/register', // Type d'action
    async (client, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:5000/api/clients', client);
            
            // Si la réponse est OK, stocker l'utilisateur dans localStorage
            if (response.data) {
                localStorage.setItem('client', JSON.stringify(response.data));
            }

            return response.data;
        } catch (error) {
            // Gestion des erreurs
            const message = 
                (error.response && error.response.data && error.response.data.message) || 
                error.message || 
                error.toString();
            
            // Rejeter la promesse et envoyer le message d'erreur
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Connexion ---
export const login = createAsyncThunk(
    'auth/login',
    async (client, thunkAPI) => {
        try {
            const response = await axios.post('http://localhost:5000/api/clients/login', client);
            
            if (response.data) {
                localStorage.setItem('client', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            const message = 
                (error.response && error.response.data && error.response.data.message) || 
                error.message || 
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Déconnexion (Logout) ---
export const logout = createAsyncThunk('auth/logout', async () => {
    // La déconnexion côté frontend est simple : on retire l'utilisateur de localStorage
    localStorage.removeItem('client');
});

// ======================================================================
// 2. AUTH SLICE
// ======================================================================

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Fonction pour réinitialiser les drapeaux (isSuccess, isError, message)
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // GESTION DU REGISTER
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.client = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Le message d'erreur de rejectWithValue
                state.client = null;
            })
            
            // GESTION DU LOGIN
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.client = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.client = null;
            })

            // GESTION DU LOGOUT
            .addCase(logout.fulfilled, (state) => {
                state.client = null;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;