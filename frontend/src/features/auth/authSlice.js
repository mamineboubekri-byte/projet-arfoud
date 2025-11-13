// Fichier: frontend/src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL de base de l'API (corrigée au pluriel /api/clients/)
const API_URL = 'http://localhost:5000/api/clients/';

// Vérification du localStorage pour l'utilisateur
const client = JSON.parse(localStorage.getItem('client'));

// État initial du slice
const initialState = {
    client: client ? client : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// ======================================================================
// ASYNC THUNKS (Fonctions pour les appels API)
// ======================================================================

// --- Enregistrement (Inscription) ---
export const register = createAsyncThunk(
    'auth/register',
    async (client, thunkAPI) => {
        try {
            // Utilise API_URL pour POST /api/clients/
            const response = await axios.post(API_URL, client); 
            
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

// --- Connexion ---
export const login = createAsyncThunk(
    'auth/login',
    async (client, thunkAPI) => {
        try {
            // Utilise API_URL + 'login' pour POST /api/clients/login
            const response = await axios.post(API_URL + 'login', client);
            
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
    localStorage.removeItem('client');
});

// ======================================================================
// AUTH SLICE
// ======================================================================

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
                state.message = action.payload;
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