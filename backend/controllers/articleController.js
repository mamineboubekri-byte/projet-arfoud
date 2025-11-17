// Fichier: backend/controllers/articleController.js

const asyncHandler = require('express-async-handler');
const Article = require('../models/Article');
const Client = require('../models/Client'); // Nécessaire pour les validations futures

// @desc    Créer un nouvel article
// @route   POST /api/articles
// @access  Private (nécessite un token)
const createArticle = asyncHandler(async (req, res) => {
    // 🚨 CORRECTION 1.1: VÉRIFICATION DU CLIENT EN PREMIER POUR ÉVITER LE CRASH MASQUÉ
    if (!req.client || !req.client.id) {
        res.status(401);
        throw new Error('Non autorisé: jeton manquant ou invalide.');
    }
    
    // 1. Vérification des données requises
    const { nom, description, prix, quantiteStock } = req.body;

    if (!nom || !description || !prix || !quantiteStock) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires (nom, description, prix, quantité en stock)');
    }

    // 2. Création de l'article
    const article = await Article.create({
        client: req.client.id, // L'ID du client est injecté
        nom,
        description,
        prix,
        quantiteStock,
        // image est optionnel
    });

    // 3. Réponse de succès
    res.status(201).json(article);
});

// @desc    Obtenir les articles du client
// @route   GET /api/articles
// @access  Private
const getArticles = asyncHandler(async (req, res) => {
    // 🚨 VÉRIFICATION DU CLIENT
    if (!req.client) {
        res.status(401);
        throw new Error('Non autorisé, jeton manquant ou invalide.');
    }
    
    // Trouver tous les articles où le champ 'client' correspond à l'ID de l'utilisateur connecté
    const articles = await Article.find({ client: req.client.id }).sort({ createdAt: -1 });

    res.status(200).json(articles);
});

// @desc    Obtenir un article par ID
// @route   GET /api/articles/:id
// @access  Private
const getArticle = asyncHandler(async (req, res) => {
    // 🚨 VÉRIFICATION DU CLIENT
    if (!req.client) {
        res.status(401);
        throw new Error('Non autorisé, jeton manquant ou invalide.');
    }
    
    // 1. Trouver l'article par son ID
    const article = await Article.findById(req.params.id);

    // Vérifier si l'article existe
    if (!article) {
        res.status(404);
        throw new Error('Article non trouvé');
    }

    // 2. Vérifier que le client connecté est le propriétaire de l'article
    if (article.client.toString() !== req.client.id) {
        res.status(401); // 401: Non autorisé
        throw new Error('Non autorisé à consulter cet article');
    }

    // 3. Réponse de succès
    res.status(200).json(article);
});

// ------------------------------------------------------------------
// @desc    Mettre à jour un article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = asyncHandler(async (req, res) => {
    // 🚨 VÉRIFICATION DU CLIENT
    if (!req.client) {
        res.status(401);
        throw new Error('Non autorisé, jeton manquant ou invalide.');
    }
    
    const article = await Article.findById(req.params.id);

    // 1. Vérification d'existence
    if (!article) {
        res.status(404);
        throw new Error('Article non trouvé');
    }

    // 2. Vérification de propriété
    if (article.client.toString() !== req.client.id) {
        res.status(401); 
        throw new Error('Non autorisé à modifier cet article');
    }

    // 3. Mise à jour de l'article
    const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id,
        req.body, // Le corps de la requête contient les champs à mettre à jour
        { new: true, runValidators: true } // 'new: true' retourne le document mis à jour
    );

    res.status(200).json(updatedArticle);
});

// ------------------------------------------------------------------
// @desc    Supprimer un article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = asyncHandler(async (req, res) => {
    // 🚨 VÉRIFICATION DU CLIENT
    if (!req.client) {
        res.status(401);
        throw new Error('Non autorisé, jeton manquant ou invalide.');
    }
    
    const article = await Article.findById(req.params.id);

    // 1. Vérification d'existence
    if (!article) {
        res.status(404);
        throw new Error('Article non trouvé');
    }

    // 2. Vérification de propriété
    if (article.client.toString() !== req.client.id) {
        res.status(401); 
        throw new Error('Non autorisé à supprimer cet article');
    }

    // 🚨 CORRECTION 1.2: Utilisation de findByIdAndDelete pour garantir un objet retourné
    await Article.findByIdAndDelete(req.params.id); 

    res.status(200).json({ id: req.params.id }); // On retourne l'ID de l'article supprimé
});

module.exports = {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle,
};