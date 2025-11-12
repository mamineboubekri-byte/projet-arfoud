import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './main.css'
import axios from 'axios'; // <-- AJOUTER Axios

// CONFIGURATION AXIOS GLOBALE : Indiquer où se trouve le Backend
axios.defaults.baseURL = 'http://localhost:5000'; // <-- Axios

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
