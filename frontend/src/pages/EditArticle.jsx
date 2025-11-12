// Fichier: frontend/src/pages/EditArticle.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importation de useParams
import axios from 'axios';

function EditArticle() {
    const navigate = useNavigate();
    // Utilisation de useParams pour obtenir l'ID de l'article depuis l'URL
    const { id } = useParams(); // <-- NOUVEAU: Récupérer l'ID

    // État pour stocker les données de l'article (initialisé avec des chaînes vides)
    const [formData, setFormData] = useState({
        nom: '', 
        description: '',
        prix: '', 
        quantiteStock: '',
    });

    // État pour gérer les messages et le chargement
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { nom, description, prix, quantiteStock } = formData;
    const client = JSON.parse(localStorage.getItem('client'));
    const token = client ? client.token : null;

    // Redirection si non connecté
    useEffect(() => {
        if (!client) {
            navigate('/login');
        }
    }, [client, navigate]);

    // ----------------------------------------------------
    // 1. FONCTION POUR CHARGER LES DONNÉES DE L'ARTICLE EXISTANT
    // ----------------------------------------------------
    useEffect(() => {
        const fetchArticleData = async () => {
            if (!token || !id) {
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                // Appel API GET /api/articles/:id
                const response = await axios.get(`http://localhost:5000/api/articles/${id}`, config);
                const articleData = response.data;

                // Pré-remplir le formulaire avec les données existantes
                setFormData({
                    nom: articleData.nom || '',
                    description: articleData.description || '',
                    // Convertir en chaînes pour éviter l'affichage de '0' (comme corrigé dans ArticleForm)
                    prix: articleData.prix.toString(), 
                    quantiteStock: articleData.quantiteStock.toString(),
                });
                setLoading(false);

            } catch (err) {
                console.error('Erreur lors du chargement de l\'article:', err);
                setError('Impossible de charger les données de l\'article. Peut-être non autorisé.');
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [id, token, navigate]);

    // ----------------------------------------------------
    // 2. FONCTION POUR GÉRER LE CHANGEMENT DES CHAMPS
    // ----------------------------------------------------
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // ----------------------------------------------------
    // 3. FONCTION POUR LA SOUMISSION DU FORMULAIRE (UPDATE)
    // ----------------------------------------------------
    const onSubmit = async (e) => {
        e.preventDefault();
        
        const updatedArticleData = {
            nom, 
            description,
            // S'assurer de la conversion avant l'envoi
            prix: parseFloat(prix || 0),
            quantiteStock: parseInt(quantiteStock || 0), 
        };
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            // Appel API PUT pour la modification
            await axios.put(`http://localhost:5000/api/articles/${id}`, updatedArticleData, config);
            
            alert(`Article "${nom}" mis à jour avec succès.`);
            // Rediriger l'utilisateur vers le dashboard après la modification
            navigate('/dashboard');
            
        } catch (error) {
            const errorMessage = (error.response && error.response.data && error.response.data.message) || 'Erreur lors de la mise à jour de l\'article.';
            alert(errorMessage);
            console.error('Erreur de mise à jour:', error);
        }
    };

    // Rendu du composant (Chargement / Erreur)
    if (loading) {
        return <h1>Chargement des données de l'article...</h1>;
    }

    if (error) {
        return <h1>Erreur: {error}</h1>;
    }

    return (
        <section className='container'>
            <header className='heading'>
                <h1>Modification de l'Article</h1>
                <p>Mettez à jour les informations de: **{nom}**</p>
            </header>

            <section className='article-form'>
                <form onSubmit={onSubmit}>
                    
                    {/* Champ NOM */}
                    <div className='form-group'>
                        <label htmlFor='nom'>Nom de l'article</label>
                        <input
                            type='text'
                            name='nom'
                            id='nom'
                            className='form-control'
                            value={nom}
                            onChange={onChange}
                            required
                        />
                    </div>

                    {/* Champ Description */}
                    <div className='form-group'>
                        <label htmlFor='description'>Description</label>
                        <textarea
                            name='description'
                            id='description'
                            className='form-control'
                            value={description}
                            onChange={onChange}
                            required
                        ></textarea>
                    </div>
                    
                    {/* Champ Prix */}
                    <div className='form-group'>
                        <label htmlFor='prix'>Prix (en devise locale)</label>
                        <input
                            type='number'
                            name='prix'
                            id='prix'
                            className='form-control'
                            value={prix}
                            onChange={onChange}
                            min='0'
                            step='0.01'
                            required
                        />
                    </div>

                    {/* Champ QUANTITÉ EN STOCK */}
                    <div className='form-group'>
                        <label htmlFor='quantiteStock'>Quantité en stock</label>
                        <input
                            type='number'
                            name='quantiteStock'
                            id='quantiteStock'
                            className='form-control'
                            value={quantiteStock}
                            onChange={onChange}
                            min='0'
                            required
                        />
                    </div>
                    
                    {/* Bouton de Soumission */}
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>
                            Mettre à jour l'Article
                        </button>
                    </div>
                </form>
            </section>
        </section>
    );
}

export default EditArticle;