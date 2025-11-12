// Fichier: frontend/src/components/ArticleForm.jsx (Version finale et propre)

import React, { useState } from 'react';
import axios from 'axios';

function ArticleForm() {
    // CORRECTION: Utiliser des chaînes vides '' pour les champs numériques 
    // afin d'afficher le placeholder au lieu de 0.
    const [formData, setFormData] = useState({
        nom: '', 
        description: '',
        prix: '', // Changé de 0 à ''
        quantiteStock: '', // Changé de 0 à ''
    });

    const { nom, description, prix, quantiteStock } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Récupérer le token
        const clientInfo = JSON.parse(localStorage.getItem('client'));
        const token = clientInfo ? clientInfo.token : null;

        if (!token) {
            alert("Erreur d'authentification. Veuillez vous reconnecter.");
            return;
        }

        // 2. Préparer les données de l'article (conversion en nombres ici)
        const articleData = {
            nom, 
            description,
            // CONVERSION: Si la chaîne est vide, on utilise 0 pour la soumission.
            prix: parseFloat(prix || 0),
            quantiteStock: parseInt(quantiteStock || 0), 
        };
        
        // 3. Préparer la configuration de l'appel API
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            // Appel API POST avec l'URL complète
            const response = await axios.post('http://localhost:5000/api/articles', articleData, config);
            
            alert(`Article créé avec succès : ${response.data.nom}`);
            
        } catch (error) {
            const errorMessage = (error.response && error.response.data && error.response.data.message) || 'Erreur lors de la création de l\'article.';
            alert(errorMessage);
            console.error('Erreur de création d\'article:', error);
        }

        // 5. Réinitialiser le formulaire (avec des chaînes vides)
        setFormData({
            nom: '',
            description: '',
            prix: '',
            quantiteStock: '',
        });
    };

    return (
        <section className='article-form'>
            <h3 style={{marginBottom: '15px'}}>Ajouter un Nouvel Article</h3>
            <form onSubmit={onSubmit}>
                
                {/* Champ NOM */}
                <div className='form-group'>
                    <label htmlFor='nom'>Nom de l'article</label> {/* AJOUT du label */}
                    <input
                        type='text'
                        name='nom'
                        id='nom'
                        className='form-control'
                        value={nom}
                        placeholder="Ex: Ordinateur Portable Gamer" 
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Champ Description */}
                <div className='form-group'>
                    <label htmlFor='description'>Description</label> {/* AJOUT du label */}
                    <textarea
                        name='description'
                        id='description'
                        className='form-control'
                        value={description}
                        placeholder="Description détaillée de l'article..." 
                        onChange={onChange}
                        required
                    ></textarea>
                </div>
                
                {/* Champ Prix */}
                <div className='form-group'>
                    <label htmlFor='prix'>Prix (en devise locale)</label> {/* AJOUT du label */}
                    <input
                        type='number'
                        name='prix'
                        id='prix'
                        className='form-control'
                        value={prix}
                        placeholder='Ex: 1500.00' 
                        onChange={onChange}
                        min='0'
                        step='0.01'
                        required
                    />
                </div>

                {/* Champ QUANTITÉ EN STOCK */}
                <div className='form-group'>
                    <label htmlFor='quantiteStock'>Quantité en stock</label> {/* AJOUT du label */}
                    <input
                        type='number'
                        name='quantiteStock'
                        id='quantiteStock'
                        className='form-control'
                        value={quantiteStock}
                        placeholder='Ex: 10' 
                        onChange={onChange}
                        min='0'
                        required
                    />
                </div>
                
                {/* Bouton de Soumission */}
                <div className='form-group'>
                    <button type='submit' className='btn btn-block'>
                        Créer l'Article
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ArticleForm;