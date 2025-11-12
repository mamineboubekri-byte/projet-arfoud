// Fichier: frontend/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Nous allons le créer juste après
import Home from './pages/Home'; // Nous allons créer la page Home
import Register from './pages/Register'; // <-- Page Register
import Login from './pages/Login'; // <-- Page Login
import Dashboard from './pages/Dashboard'; // <-- Page dashboard

// NOTE: Pour l'instant, nous utiliserons le composant Home pour toutes les routes
// Nous allons bientôt créer les pages Login, Register et Dashboard
function App() {
  return (
    // 1. Définition du Router pour toute l'application
    <Router>
        <div className='container'>
        <Navbar /> {/* Le composant de navigation qui sera toujours visible */}
        
        {/* 2. Définition des différentes routes */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} /> 
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;