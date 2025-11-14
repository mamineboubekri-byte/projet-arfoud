// Fichier: backend/controllers/clientController.js (Contenu entier, à jour)

const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const saltRounds = 10;

// Génère le Token JWT (réutilisé pour un code plus propre)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};


// @desc Enregistrer un nouveau client (Inscription)
// @route POST /api/clients/
// @access Public
exports.registerClient = asyncHandler(async (req, res) => {
    const { nom, prenom, email, motDePasse } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
        res.status(400);
        throw new Error('Veuillez ajouter tous les champs requis');
    }

    const clientExiste = await Client.findOne({ email });
    if (clientExiste) {
        res.status(400);
        throw new Error('Un client avec cet email existe déjà.');
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

    const nouveauClient = await Client.create({
        nom,
        prenom,
        email,
        motDePasse: hashedPassword
    });

    if (nouveauClient) {
        res.status(201).json({
            _id: nouveauClient._id,
            nom: nouveauClient.nom,
            prenom: nouveauClient.prenom,
            email: nouveauClient.email,
            token: generateToken(nouveauClient._id),
            message: "Client enregistré avec succès."
        });
    } else {
        res.status(400);
        throw new Error('Données client invalides');
    }
});


// @desc Authentifier un client
// @route POST /api/clients/login
// @access Public
exports.loginClient = asyncHandler(async (req, res) => {
    const { email, motDePasse } = req.body;

    // 1. Trouver le client par email
    const client = await Client.findOne({ email });

    // 2. Vérification: client existe ET mot de passe correspond
    // On vérifie que client n'est PAS null et que le mot de passe correspond.
    if (client && (await bcrypt.compare(motDePasse, client.motDePasse))) { 
        // Succès
        res.status(200).json({
            _id: client._id, 
            nom: client.nom,
            email: client.email,
            token: generateToken(client._id),
        });
    } else {
        // Échec de la connexion. Status 401 pour non autorisé.
        res.status(401); 
        throw new Error('Identifiants invalides (Email ou mot de passe incorrect).'); 
    }
});


// @desc Récupérer le profil d'un client (Route Protégée)
// @route GET /api/clients/profile
// @access Private
exports.getClientProfile = asyncHandler(async (req, res) => {
    // Les infos du client sont disponibles via req.client (ajoutées par le middleware)
    res.status(200).json({
        _id: req.client._id,
        nom: req.client.nom,
        prenom: req.client.prenom,
        email: req.client.email,
        dateCreation: req.client.dateCreation
    });
});