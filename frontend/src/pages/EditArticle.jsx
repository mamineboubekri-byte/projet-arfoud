// Fichier: frontend/src/pages/EditArticle.jsx (Contenu entier, refactorisé pour utiliser Redux)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
// 🚨 MODIFICATION DES IMPORTS: AJOUT de getArticles
import { useSelector, useDispatch } from 'react-redux'; 
import { updateArticle, reset as resetArticleState, getArticles } from '../features/articles/articleSlice';

// Si vous aviez un import axios ici, vous devez le SUPPRIMER

function EditArticle() {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const { id } = useParams();

    // 🚨 NOUVEAU: Récupération de l'état Redux pour l'article et l'authentification
    const { 
        articles, 
        isError, 
        isSuccess, 
        isLoading,
        message: articleMessage
    } = useSelector((state) => state.article);
    
    const { client } = useSelector((state) => state.auth); 

    // Trouver l'article actuel dans le store (remplace l'appel API GET initial)
    const currentArticle = articles.find(article => article._id === id);

    // État local pour le formulaire
    const [formData, setFormData] = useState({
        nom: '', 
        description: '',
        prix: '', 
        quantiteStock: '',
    });

    const { nom, description, prix, quantiteStock } = formData;
    const dispatchHandledRef = useRef(false);

    // ----------------------------------------------------
    // 1. Redirection si non connecté (Auth)
    // ----------------------------------------------------
    useEffect(() => {
        if (!client) {
            navigate('/login');
        }
    }, [client, navigate]);

    // ----------------------------------------------------
    // 2. Pré-remplissage du formulaire et Chargement des articles (SI ABSENTS)
    // ----------------------------------------------------
    useEffect(() => {
        // 🚨 VÉRIFICATION ET CHARGEMENT DE SÉCURITÉ
        // Si le tableau est vide, on déclenche le chargement des articles
        if (articles.length === 0) {
            dispatch(getArticles());
        }

        if (currentArticle) {
             // Pré-remplir le formulaire avec les données existantes du store Redux
            setFormData({
                nom: currentArticle.nom || '',
                description: currentArticle.description || '',
                prix: currentArticle.prix.toString(), 
                quantiteStock: currentArticle.quantiteStock.toString(),
            });
        }
    }, [currentArticle, articles, dispatch]); // Dépendances mises à jour


    // ----------------------------------------------------
    // 3. Gestion des messages Redux et Redirection (Post-soumission)
    // ----------------------------------------------------
    useEffect(() => {
        // Logique pour gérer les messages et la redirection après le dispatch
        if ((!isError && !isSuccess) || dispatchHandledRef.current) {
            dispatchHandledRef.current = false; 
            return;
        }

        if (isError) {
            toast.error(articleMessage);
        }

        if (isSuccess) {
            toast.success(articleMessage);
            navigate('/dashboard'); 
        }

        dispatchHandledRef.current = true;
        dispatch(resetArticleState());
        
    }, [isError, isSuccess, articleMessage, dispatch, navigate]);


    // ----------------------------------------------------
    // 4. Fonction pour gérer le changement des champs
    // ----------------------------------------------------
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // ----------------------------------------------------
    // 5. Soumission du formulaire (UPDATE via Redux Thunk)
    // ----------------------------------------------------
    const onSubmit = (e) => {
        e.preventDefault();
        
        const articleToUpdate = {
            _id: id, // ID de l'article provenant de l'URL
            nom, 
            description,
            // S'assurer de la conversion avant l'envoi
            prix: parseFloat(prix || 0),
            quantiteStock: parseInt(quantiteStock || 0), 
        };
        
        // Dispatch de l'action Redux au lieu de l'appel axios direct
        dispatch(updateArticle(articleToUpdate));
    };

    // Rendu du composant (Chargement / Article introuvable)
    if (isLoading) {
        return <h1>Mise à jour de l'article en cours...</h1>;
    }
    
    // Si la liste est en cours de chargement, on affiche un message d'attente
    // La première condition (articles.length === 0) est maintenant gérée par le dispatch ci-dessus
    // Si currentArticle est introuvable après le chargement, on affiche l'erreur.
    if (!currentArticle) {
        // Affiche un message si l'article n'a pas été trouvé dans le store Redux
        return <h1>Article introuvable. Veuillez retourner au Tableau de Bord.</h1>;
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