// Fichier: frontend/src/pages/Dashboard.jsx 

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; 

// Importation des composants et des actions REDUX
import ArticleForm from '../components/ArticleForm';
import ArticleItem from '../components/ArticleItem';
import { getArticles, deleteArticle, reset as resetArticleState } from '../features/articles/articleSlice';
import { reset as resetAuthState } from '../features/auth/authSlice';


function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Récupération des états REDUX
    const { client } = useSelector((state) => state.auth);
    const {
        articles,
        isLoading,
        isError,
        isSuccess,
        message
    } = useSelector((state) => state.article);

    // Réf pour bloquer le double appel de getArticles en Mode Strict
    const articlesFetchedRef = useRef(false);
    const alertHandledRef = useRef(false); 


    // 2. Gestion de l'état Auth et du Chargement Initial des articles
    useEffect(() => {
        if (!client) {
            navigate('/login');
            dispatch(resetArticleState());
            dispatch(resetAuthState());
            return;
        }

        // Appel de getArticles uniquement si ce n'est pas le Strict Mode
        if (articlesFetchedRef.current === false) {
            dispatch(getArticles()); 
            articlesFetchedRef.current = true;
        }
        
        // Nettoyage de l'état Redux au démontage du composant
        return () => {
            dispatch(resetArticleState());
        };
        // Dépendances minimales pour le chargement initial.
    }, [client, navigate, dispatch]);


    // 3. Gestion des messages de Succès/Erreur APRÈS ACTION et RECHARGEMENT
    useEffect(() => {
        // Sortir si aucun message ou si déjà traité
        if ((!isError && !isSuccess) || alertHandledRef.current) {
            alertHandledRef.current = false; 
            return;
        }

        // Utilisation de toastify pour les messages
        if (isError) {
            toast.error(message);
        }

        if (isSuccess && message) {
            // Afficher le toast pour les actions utilisateur réussies
            if (message !== 'Articles chargés') { 
                toast.success(message);
            }
            
            // 🚨 CORRECTION 2.1: Recharger la liste des articles après toute action réussie (Création/Suppression/Modification)
            if (message.includes('succès')) { 
                 dispatch(getArticles()); 
            }
        }
        
        // Marquer comme traité et réinitialiser l'état
        alertHandledRef.current = true;
        dispatch(resetArticleState());

    }, [isSuccess, isError, message, dispatch]);


    // 4. Fonction de suppression (Appelle l'action deleteArticle de Redux)
    const onDelete = (articleId) => {
        dispatch(deleteArticle(articleId));
    };


    // 5. Affichage des états (Chargement/Erreur)
    if (isLoading) {
        return <h1>Chargement des articles...</h1>;
    }

    // 6. Rendu principal
    return (
        <>
            <section className='heading'>
                <h1>Bienvenue, {client && client.nom}</h1>
                <p>Vos articles en stock :</p>
            </section>

            <ArticleForm />

            <section className='content'>
                <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>
                    Vos Articles ({Array.isArray(articles) ? articles.length : 0})
                </h3>

                {/* Assurer que 'articles' est un tableau pour le rendu */}
                {Array.isArray(articles) && articles.length > 0 ? (
                    <div className='articles'>
                        {articles.map((article) => (
                            <ArticleItem
                                key={article._id}
                                article={article}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <h3>Vous n'avez pas encore d'articles enregistrés.</h3>
                )}
            </section>
        </>
    );
}

export default Dashboard;