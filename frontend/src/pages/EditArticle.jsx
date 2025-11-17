import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaPlus } from 'react-icons/fa';

// Importation des thunks CRUD et du reset
import { 
    createArticle, 
    updateArticle, 
    getArticles, 
    reset 
} from '../features/article/articleSlice';

import Spinner from '../components/Spinner';

// Composant de chargement simple (réutilisé de Dashboard.jsx)
const SpinnerComponent = () => (
    <div className='loadingSpinnerContainer'>
        <div className='loadingSpinner'></div>
    </div>
);


function EditArticle() {
    // Hooks de routage et Redux
    const { id: articleId } = useParams(); // Récupère l'ID (ou 'new') depuis l'URL
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // États Redux
    const { client } = useSelector((state) => state.auth);
    const { articles, isLoading, isError, isSuccess, message } = useSelector((state) => state.articles);

    // Initialisation du formulaire
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: 0,
        quantiteStock: 0,
        categorie: '',
    });

    const isEditMode = articleId !== 'new'; // Vrai si on est en mode édition
    // Trouver l'article actuel pour l'édition, en se basant sur l'état Redux
    const currentArticle = isEditMode ? articles.find(a => a._id === articleId) : null;
    
    // =========================================================================
    // 1. Logique d'initialisation et de chargement des données
    // =========================================================================
    
    useEffect(() => {
        // Redirection si l'utilisateur n'est pas Admin
        if (!client || !client.isAdmin) {
            navigate('/login');
            return;
        }

        // Si une erreur de Redux survient
        if (isError) {
            toast.error(message);
        }

        // Si on est en mode édition et que les articles ne sont pas encore chargés dans Redux,
        // on lance la récupération (cela permet de peupler le formulaire)
        if (isEditMode && articles.length === 0) {
             dispatch(getArticles());
        }

        // Si on est en mode édition et que l'article est trouvé
        if (isEditMode && currentArticle) {
            // Remplissage du formulaire avec les données de l'article
            setFormData({
                nom: currentArticle.nom || '',
                description: currentArticle.description || '',
                // Assurez-vous que les valeurs numériques sont prêtes pour le formulaire
                prix: currentArticle.prix || 0,
                quantiteStock: currentArticle.quantiteStock || 0,
                categorie: currentArticle.categorie || '',
            });
        }
        
        // Si on est en mode édition mais que l'article n'est pas trouvé (après chargement)
        if (isEditMode && articles.length > 0 && !currentArticle && !isLoading) {
            toast.error("Article non trouvé.");
            navigate('/dashboard'); // Retour au dashboard
        }

        // Nettoyage des flags d'état Redux (isSuccess, isError, message)
        return () => {
            dispatch(reset());
        };
        // Dépendances : Assurez-vous d'avoir toutes les dépendances nécessaires ici
        // Les dépendances 'currentArticle' et 'articles.length' gèrent le cycle de vie du chargement
    }, [client, articleId, articles.length, isEditMode, currentArticle, isError, message, navigate, dispatch]);


    // =========================================================================
    // 2. Gestion des changements et de la soumission du formulaire
    // =========================================================================
    
    // Gère la mise à jour des champs (nom, prix, etc.)
    const onChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        // Conversion en nombre pour les champs numériques
        if (name === 'prix' || name === 'quantiteStock') {
            // Utiliser parseFloat pour le prix (peut être décimal)
            value = parseFloat(value);
            if (isNaN(value)) {
                // Empêche la saisie de caractères non numériques et conserve la valeur vide ou précédente
                value = e.target.type === 'number' ? '' : e.target.value; 
            }
        }

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Gère la soumission du formulaire
    const onSubmit = (e) => {
        e.preventDefault();

        // Vérification simple des données
        if (!formData.nom || !formData.description || formData.prix <= 0 || formData.quantiteStock < 0 || formData.prix === '') {
            toast.error("Veuillez vérifier les champs obligatoires (nom, description, prix > 0, quantité >= 0).");
            return;
        }

        if (isEditMode) {
            // === LOGIQUE DE MODIFICATION (UPDATE) ===
            const dataToUpdate = {
                id: articleId, // L'ID est requis pour la route PUT
                // Assurez-vous que les données envoyées sont au format attendu par le backend (ex: prix en tant que nombre)
                nom: formData.nom,
                description: formData.description,
                prix: parseFloat(formData.prix),
                quantiteStock: parseInt(formData.quantiteStock, 10),
                categorie: formData.categorie,
            };
            
            dispatch(updateArticle(dataToUpdate))
                .unwrap() // Permet de gérer le fulfilled ou rejected avec .then/.catch
                .then(() => {
                    toast.success('Article mis à jour avec succès !');
                    navigate('/dashboard');
                })
                .catch((error) => {
                    // L'erreur est déjà toastée dans le slice, mais on peut ajouter un message générique ici
                    toast.error(`Erreur de mise à jour : ${error}`);
                });

        } else {
            // === LOGIQUE DE CRÉATION (CREATE) ===
            const dataToCreate = {
                // Assurez-vous que les données envoyées sont au format attendu par le backend
                nom: formData.nom,
                description: formData.description,
                prix: parseFloat(formData.prix),
                quantiteStock: parseInt(formData.quantiteStock, 10),
                categorie: formData.categorie,
            };
            
            dispatch(createArticle(dataToCreate))
                .unwrap()
                .then(() => {
                    toast.success('Article créé avec succès !');
                    navigate('/dashboard');
                })
                .catch((error) => {
                    toast.error(`Erreur de création : ${error}`);
                });
        }
    };

    // =========================================================================
    // 3. Affichage du composant
    // =========================================================================

    // Affichage du spinner pendant le chargement des articles pour l'édition
    if (isLoading && isEditMode && articles.length === 0) {
        return <SpinnerComponent />;
    }
    
    // Si on est en mode édition et que l'article n'est pas encore chargé/trouvé
    if (isEditMode && !currentArticle) {
        // Si le chargement est terminé mais que l'article n'a pas été trouvé (ce cas est géré dans l'useEffect)
        if (!isLoading && articles.length > 0) {
            return null; // L'useEffect s'occupera de la redirection et du toast
        }
        // Sinon, on affiche le spinner tant qu'on charge
        return <SpinnerComponent />;
    }
    
    // Affichage du spinner pendant le chargement pour les actions (création/mise à jour)
    if (isLoading) {
         // Si isLoading est true ici, cela signifie que le thunk est en cours (update/create)
         // On peut afficher le formulaire, mais désactiver le bouton de soumission
    }
    
    const pageTitle = isEditMode ? `Modifier l'Article: ${currentArticle?.nom || 'Chargement...'}` : "Créer un Nouvel Article";

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
            <section className='heading mb-8'>
                <h1 className="text-4xl font-bold text-gray-800 flex items-center mb-2">
                    {isEditMode ? <FaEdit className="mr-3 text-indigo-600" /> : <FaPlus className="mr-3 text-green-600" />}
                    {pageTitle}
                </h1>
                <p className='text-lg text-gray-600'>Remplissez les informations de l'article</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Nom de l'Article */}
                    <div className='form-group'>
                        <label htmlFor='nom' className="block text-sm font-medium text-gray-700">Nom de l'Article *</label>
                        <input
                            type='text'
                            className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                            id='nom'
                            name='nom'
                            value={formData.nom}
                            onChange={onChange}
                            required
                        />
                    </div>
                    
                    {/* Description */}
                    <div className='form-group'>
                        <label htmlFor='description' className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={onChange}
                            rows='4'
                            required
                        ></textarea>
                    </div>

                    {/* Prix et Quantité (Flex Row) */}
                    <div className="flex space-x-4">
                        {/* Prix */}
                        <div className='form-group flex-1'>
                            <label htmlFor='prix' className="block text-sm font-medium text-gray-700">Prix (€) *</label>
                            <input
                                type='number'
                                step='0.01'
                                className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                                id='prix'
                                name='prix'
                                value={formData.prix}
                                onChange={onChange}
                                min='0'
                                required
                            />
                        </div>

                        {/* Quantité en Stock */}
                        <div className='form-group flex-1'>
                            <label htmlFor='quantiteStock' className="block text-sm font-medium text-gray-700">Quantité en Stock *</label>
                            <input
                                type='number'
                                className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                                id='quantiteStock'
                                name='quantiteStock'
                                value={formData.quantiteStock}
                                onChange={onChange}
                                min='0'
                                required
                            />
                        </div>
                    </div>

                    {/* Catégorie */}
                    <div className='form-group'>
                        <label htmlFor='categorie' className="block text-sm font-medium text-gray-700">Catégorie</label>
                        <input
                            type='text'
                            className='form-control w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500'
                            id='categorie'
                            name='categorie'
                            value={formData.categorie}
                            onChange={onChange}
                            placeholder='Ex: Électronique, Vêtements...'
                        />
                    </div>
                    
                    {/* Bouton de soumission */}
                    <div className='form-group pt-4'>
                        <button 
                            type='submit' 
                            className={`w-full py-3 text-white font-bold rounded-lg shadow-lg transition duration-300 ${isEditMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Traitement...' : isEditMode ? 'Mettre à Jour l\'Article' : 'Créer l\'Article'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default EditArticle;