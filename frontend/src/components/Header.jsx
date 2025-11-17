// Fichier: frontend/src/components/Header.jsx (Contenu complet)

import React from 'react';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset as resetAuthState } from '../features/auth/authSlice';
import { reset as resetArticleState } from '../features/articles/articleSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Récupérer l'état du client connecté
    const { client } = useSelector((state) => state.auth);

    // Fonction de déconnexion
    const onLogout = () => {
        dispatch(logout()); 
        dispatch(resetAuthState());
        dispatch(resetArticleState());
        navigate('/login');
    };

    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>Gestion de Stock</Link>
            </div>
            <ul>
                {client ? (
                    <>
                        <li>
                            <Link to='/'>
                                <FaUser /> Tableau de Bord
                            </Link>
                        </li>
                        <li>
                            <button className='btn' onClick={onLogout}>
                                <FaSignOutAlt /> Déconnexion
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Connexion
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                <FaUser /> Inscription
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;