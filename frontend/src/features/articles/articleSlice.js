// Fichier: frontend/src/features/articles/articleSlice.js (Contenu entier Corrigé)

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import articleService from './articleService';

const initialState = {
    articles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// ==================== THUNKS ASYNCHRONES ====================

// Créer un nouvel article
export const createArticle = createAsyncThunk(
    'article/create',
    async (articleData, thunkAPI) => {
        try {
            // 🚨 CORRECTION 1.1: Vérification de l'existence du jeton
            const client = thunkAPI.getState().auth.client;
            if (!client || !client.token) {
                 return thunkAPI.rejectWithValue('Non autorisé : Connexion requise.');
            }
            const token = client.token;
            // Fin de la correction
            
            return await articleService.createArticle(articleData, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Obtenir tous les articles
export const getArticles = createAsyncThunk(
    'article/getAll',
    async (_, thunkAPI) => {
        try {
            // 🚨 CORRECTION CRITIQUE 2.1: Vérification de l'existence du jeton
            const client = thunkAPI.getState().auth.client;
            if (!client || !client.token) {
                 return thunkAPI.rejectWithValue('Non autorisé : Connexion requise pour charger les articles.');
            }
            const token = client.token;
            // Fin de la correction
            
            return await articleService.getArticles(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Mettre à jour un article
export const updateArticle = createAsyncThunk(
    'article/update',
    async (articleData, thunkAPI) => {
        try {
            // 🚨 CORRECTION 3.1: Vérification de l'existence du jeton
            const client = thunkAPI.getState().auth.client;
            if (!client || !client.token) {
                 return thunkAPI.rejectWithValue('Non autorisé : Connexion requise.');
            }
            const token = client.token;
            // Fin de la correction
            
            return await articleService.updateArticle(articleData, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Supprimer un article
export const deleteArticle = createAsyncThunk(
    'article/delete',
    async (id, thunkAPI) => {
        try {
            // 🚨 CORRECTION 4.1: Vérification de l'existence du jeton
            const client = thunkAPI.getState().auth.client;
            if (!client || !client.token) {
                 return thunkAPI.rejectWithValue('Non autorisé : Connexion requise.');
            }
            const token = client.token;
            // Fin de la correction
            
            return await articleService.deleteArticle(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ==================== SLICE ====================

export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // ==================== CREATE ARTICLE ====================
            .addCase(createArticle.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false; // Réinitialiser l'erreur
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Article créé avec succès'; 
                state.articles.unshift(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // ==================== GET ARTICLES ====================
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Articles chargés'; // Changement pour plus de clarté
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.articles = []; // Vider le tableau en cas d'erreur de chargement
            })

            // ==================== UPDATE ARTICLE ====================
            .addCase(updateArticle.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Article modifié avec succès"; 

                // Trouver l'index de l'article mis à jour
                const index = state.articles.findIndex(
                    (article) => article._id === action.payload._id
                );

                // Remplacer l'ancien article par le nouveau dans le tableau
                if (index !== -1) {
                    state.articles[index] = action.payload;
                }
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // ==================== DELETE ARTICLE ====================
            .addCase(deleteArticle.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Article supprimé avec succès';
                
                // action.payload est maintenant l'objet retourné par le service (devrait être l'ID)
                // L'hypothèse est que le service retourne { id: l'ID supprimé }
                state.articles = state.articles.filter(
                    (article) => article._id !== action.payload.id 
                );
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = articleSlice.actions;
export default articleSlice.reducer;