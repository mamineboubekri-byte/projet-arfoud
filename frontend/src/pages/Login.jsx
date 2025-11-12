// Fichier: frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import nécessaire pour l'API

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
  });

  const { email, motDePasse } = formData;
  const navigate = useNavigate();

  // 1. Gérer les changements dans le formulaire
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 2. Gérer la soumission du formulaire et l'appel API
  const onSubmit = async (e) => {
    e.preventDefault();

    const clientData = {
      email,
      motDePasse,
    };
    
    try {
        // Appel API POST /api/client/login (L'URL de base est dans main.jsx)
        const response = await axios.post('/api/client/login', clientData);

        if (response.data.token) {
            // Stocker le token JWT pour maintenir la session
            localStorage.setItem('client', JSON.stringify(response.data));
            
            alert('Connexion réussie !');
            navigate('/dashboard'); // Rediriger
        }

    } catch (error) {
        // Gérer les erreurs (401 du Backend si identifiants incorrects, ou erreur réseau)
        const errorMessage = (error.response && error.response.data && error.response.data.message) || 'Erreur lors de la connexion. Veuillez vérifier vos identifiants ou la connexion au serveur.';
        alert(errorMessage);
        console.error('Erreur de connexion:', error);
    }
  };

  return (
    <>
      <section className='heading'>
        <h1>Se Connecter</h1>
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
              placeholder='Entrez votre mot de passe'
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