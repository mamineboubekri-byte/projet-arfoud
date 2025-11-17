// Fichier: frontend/src/pages/Login.jsx (Contenu entier Corrigé)

import React, { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// 🚨 CORRECTION 1.1: Import de toast
import { toast } from 'react-toastify'; 
import { login, reset } from '../features/auth/authSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '',
    });

    const { email, motDePasse } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Récupération de l'état (state) de Redux
    const { client, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    // Effet pour gérer les redirections et les messages
    useEffect(() => {
        if (isError) {
            // 🚨 CORRECTION 1.2: Remplacer alert par toast.error
            toast.error(message); 
        }

        // Si la connexion est réussie ou si l'utilisateur est déjà connecté
        if (isSuccess || client) {
            navigate('/');
        }

        // Réinitialiser les drapeaux (isSuccess, isError) après leur utilisation
        dispatch(reset());

    }, [client, isError, isSuccess, message, navigate, dispatch]);


    // Gère la mise à jour des champs du formulaire
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Gère la soumission du formulaire
    const onSubmit = (e) => {
        e.preventDefault();

        const clientData = {
            email,
            motDePasse,
        };

        // APPEL DE L'ACTION REDUX (remplace l'appel axios direct)
        dispatch(login(clientData));
    };

    // Affichage de chargement
    if (isLoading) {
        return <h1>Chargement...</h1>;
    }

    return (
        <>
            <section className='heading'>
                <h1>
                    <FaSignInAlt /> Se Connecter
                </h1>
                <p>Connectez-vous pour voir vos articles</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Entrer votre email'
                            onChange={onChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            id='motDePasse'
                            name='motDePasse'
                            value={motDePasse}
                            placeholder='Entrer votre mot de passe'
                            onChange={onChange}
                        />
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>
                            Se Connecter
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Login;