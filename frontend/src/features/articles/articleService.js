// Fichier: frontend/src/features/articles/articleService.js (Contenu entier avec la modification commentée)

import axios from 'axios';

// URL de base de l'API Articles
const API_URL = 'http://localhost:5000/api/articles'; 

// Fonction pour Créer un nouvel article
const createArticle = async (articleData, token) => {
    // La configuration inclut le token JWT dans les headers d'autorisation
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    // Appel POST à la route /api/articles
    const response = await axios.post(API_URL, articleData, config);

    return response.data;
};

// Fonction pour Récupérer les articles de l'utilisateur
const getArticles = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Appel GET à la route /api/articles
    const response = await axios.get(API_URL, config);
    
    // Le contrôleur renvoie un tableau d'articles
    return response.data;
};

// Fonction pour Supprimer un article
const deleteArticle = async (articleId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    // Appel DELETE à la route /api/articles/:id
    const response = await axios.delete(API_URL +'/' + articleId, config);

    // Le contrôleur renvoie un message de succès
    return response.data; 
};

// 🚨 DÉBUT DE LA MODIFICATION POUR UPDATE
// Fonction pour Mettre à jour un article
const updateArticle = async (articleData, token) => {
    // articleData doit contenir l'ID de l'article (ex: { _id, nom, description, ... })
    const articleId = articleData._id;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    // Appel PUT pour mettre à jour l'article via son ID
    const response = await axios.put(API_URL + '/' + articleId, articleData, config);

    return response.data; 
};
// 🚨 FIN DE LA MODIFICATION POUR UPDATE


// On exporte toutes les fonctions du service
const articleService = {
    createArticle,
    getArticles,
    deleteArticle,
    // Les fonctions pour l'édition (update) seront ajoutées plus tard si besoin
    updateArticle, // 🚨 AJOUT DE updateArticle
};

export default articleService;