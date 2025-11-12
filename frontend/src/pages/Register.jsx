// Fichier: frontend/src/pages/Register.jsx (Version finale avec Axios robuste)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- IMPORTATION AXIOS

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    motDePasse2: '', // Pour la confirmation
  });

  const { nom, prenom, email, motDePasse, motDePasse2 } = formData;
  const navigate = useNavigate();

  // 1. Gérer les changements dans le formulaire
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 2. Gérer la soumission du formulaire
  const onSubmit = async (e) => { 
    e.preventDefault();

    if (motDePasse !== motDePasse2) {
      alert('Les mots de passe ne correspondent pas.');
    } else {
      const clientData = {
        nom,
        prenom,
        email,
        motDePasse,
      };
      
      try {
          // Appel API POST /api/client/register. L'URL de base est définie dans main.jsx.
          const response = await axios.post('/api/client/register', clientData);

          if (response.data.token) {
              // Stockage du token JWT et des infos utilisateur
              localStorage.setItem('client', JSON.stringify(response.data));
              
              alert('Inscription réussie ! Vous êtes maintenant connecté.');
              navigate('/dashboard'); // Rediriger l'utilisateur vers le tableau de bord
          }

      } catch (error) {
          console.error('Erreur de requête Axios complète:', error); 

          // CAS 1: Le serveur a répondu (erreur 4xx ou 5xx)
          if (error.response) {
              const errorMessage = error.response.data.message || 'Erreur inconnue du serveur.';
              alert(errorMessage);
          // CAS 2: La requête a échoué avant d'atteindre le serveur (CORS ou Backend éteint)
          } else {
              alert('Impossible de se connecter au Backend. Vérifiez si votre serveur Node.js sur le port 5000 est démarré.');
          }
      }
    }
  };

  return (
    <>
      <section className='heading'>
        <h1>S'inscrire</h1>
        <p>Créez votre compte client</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='nom'
              name='nom'
              value={nom}
              placeholder='Entrez votre nom'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='prenom' // Nouvelle ID
              name='prenom' // Nouveau Name
              value={prenom} // Nouvelle Value
              placeholder='Entrez votre prénom' // Nouveau Placeholder
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Entrez votre email'
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
              placeholder='Choisissez un mot de passe'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='motDePasse2'
              name='motDePasse2'
              value={motDePasse2}
              placeholder='Confirmez le mot de passe'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              S'inscrire
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;