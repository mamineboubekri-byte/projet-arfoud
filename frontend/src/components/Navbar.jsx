// Fichier: frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  // 1. Lire l'utilisateur stocké dans le localStorage
  const client = JSON.parse(localStorage.getItem('client'));

  // 2. Fonction de Déconnexion
  const onLogout = () => {
    localStorage.removeItem('client'); // Supprimer le token
    navigate('/'); // Rediriger vers la page d'accueil
    window.location.reload(); // Recharger pour rafraîchir la Navbar immédiatement
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>Gestion d'Articles</Link>
      </div>
      
      <ul>
        {client ? ( // SI le client est connecté (client existe)
          <>
            <li>
              <Link to='/dashboard'>Tableau de Bord</Link>
            </li>
            <li>
              <button className='btn' onClick={onLogout}>
                Se Déconnecter
              </button>
            </li>
          </>
        ) : ( // SINON, afficher les liens d'inscription/connexion
          <>
            <li>
              <Link to='/login'>Se Connecter</Link>
            </li>
            <li>
              <Link to='/register'>S'Inscrire</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Navbar;