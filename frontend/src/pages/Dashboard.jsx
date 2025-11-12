// Fichier: frontend/src/pages/Dashboard.jsx (Mise à jour complète)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArticleForm from '../components/ArticleForm';
import ArticleItem from '../components/ArticleItem'; // <-- NOUVEL IMPORT

function Dashboard() {
    const navigate = useNavigate();
    
    // État pour stocker la liste des articles
    const [articles, setArticles] = useState([]); // <-- AJOUT

    // État pour gérer le chargement et les erreurs
    const [loading, setLoading] = useState(true); // <-- AJOUT
    const [error, setError] = useState(null); // <-- AJOUT

    // Récupérer les informations du client depuis localStorage
    const client = JSON.parse(localStorage.getItem('client'));
    const token = client ? client.token : null;

    // Redirection si non connecté
    useEffect(() => {
        if (!client) {
            navigate('/login');
        }
    }, [client, navigate]);


    // Fonction de récupération des articles
    const fetchArticles = async () => { // <-- AJOUT de la fonction de récupération
        if (!token) {
            setLoading(false);
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/articles', config);
            setArticles(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Erreur lors de la récupération des articles:', err);
            setError('Impossible de charger les articles.');
            setLoading(false);
        }
    };

    // Appel de la fonction de récupération au chargement du composant
    useEffect(() => { // <-- AJOUT de l'effet
        fetchArticles();
    }, []); // Dépendances vides pour s'exécuter une seule fois au montage


    // Rendu du composant
    if (loading) {
        return <h1>Chargement des articles...</h1>;
    }

    if (error) {
        return <h1>Erreur: {error}</h1>;
    }

    return (
        <>
            <section className='heading'>
                <h1>Bienvenue sécurité !</h1>
                <p>Gérez ici vos articles et commandes.</p>
            </section>

            <ArticleForm /> 

            <section className='content'>
                {/* Condition d'affichage : si des articles existent */}
                <h3 style={{marginTop: '30px', marginBottom: '20px'}}>Vos Articles ({articles.length})</h3>

                {articles.length > 0 ? (
                    <div className='articles'>
                        {/* MAPPAGE SUR LA LISTE DES ARTICLES */}
                        {articles.map((article) => (
                            <ArticleItem key={article._id} article={article} />
                        ))}
                    </div>
                ) : (
                    // Message si aucun article n'existe
                    <h3>Vous n'avez pas encore créé d'articles.</h3>
                )}
            </section>
        </>
    );
}

export default Dashboard;