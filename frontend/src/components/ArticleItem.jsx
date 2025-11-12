// Fichier: frontend/src/components/ArticleItem.jsx

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importation des icônes

function ArticleItem({ article }) {
    // Note: Les fonctions de modification/suppression seront ajoutées plus tard
    const onDelete = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article : ${article.nom}?`)) {
            // Logique de suppression à implémenter ici (Redux/Context ou appel API direct)
            console.log(`Tentative de suppression de l'article ID: ${article._id}`);
        }
    };

    return (
        // La classe 'article' peut être définie dans votre main.css
        <div className='article'> 
            {/* L'article sera affiché de manière chronologique inversée (le plus récent en premier) */}
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    Créé le: {new Date(article.createdAt).toLocaleString('fr-FR')}
                </span>
            </div>
            
            <h2>{article.nom}</h2>
            <p>{article.description}</p>
            
            {/* Affichage des détails */}
            <div className='article-details'>
                <p><strong>Prix:</strong> {article.prix.toFixed(2)} €</p>
                <p><strong>Stock:</strong> {article.quantiteStock}</p>
            </div>

            {/* Boutons d'action */}
            <div className='article-actions'>
                <button 
                    className='btn btn-reverse btn-sm' 
                    // onClick={onEdit} // Fonction de modification à implémenter
                    style={{ marginRight: '10px' }}
                >
                    <FaEdit /> Modifier
                </button>
                <button 
                    className='btn btn-danger btn-sm' 
                    onClick={onDelete} 
                >
                    <FaTrash /> Supprimer
                </button>
            </div>
        </div>
    );
}

export default ArticleItem;