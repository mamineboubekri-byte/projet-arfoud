import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

// 🚨 CORRECTION CRITIQUE: Changement de /api/client/ (singulier) à /api/clients/ (pluriel)
// Ceci doit correspondre à la route définie dans backend/server.js: app.use('/api/clients', clientRoutes);
const API_URL = '/api/clients/'; 

// Récupération du client stocké dans le localStorage
const client = JSON.parse(localStorage.getItem('client'));

// État initial de Redux
const initialState = {
    client: client ? client : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// ====================================================================
// Thunk de Connexion (Login)
// ====================================================================
export const login = createAsyncThunk(
    'auth/login',
    async (clientData, thunkAPI) => {
        try {
            // Appel à /api/clients/login
            const response = await axios.post(API_URL + 'login', clientData);
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

// ====================================================================
// Thunk d'Inscription (Register)
// ====================================================================
export const register = createAsyncThunk(
    'auth/register',
    async (clientData, thunkAPI) => {
        try {
            // Appel à /api/clients/
            const response = await axios.post(API_URL, clientData); 

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

// ====================================================================
// Thunk de Déconnexion (Logout)
// ====================================================================
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('client');
});


// ====================================================================
// Définition du Slice et extraReducers
// ====================================================================
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // LOGIQUE LOGIN
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
            // LOGIQUE REGISTER
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
            // LOGIQUE LOGOUT
            .addCase(logout.fulfilled, (state) => {
                state.client = null;
                state.isError = false;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = '';
            });
    },
});

export const { reset } = authSlice.actions; 
export default authSlice.reducer;