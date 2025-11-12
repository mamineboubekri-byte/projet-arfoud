// Fichier: frontend/src/App.jsx (Mise à jour pour inclure la route de modification)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EditArticle from './pages/EditArticle'; // <-- NOUVEL IMPORT

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            {/* NOUVELLE ROUTE : Page de Modification d'Article avec ID paramètre */}
            <Route path='/edit-article/:id' element={<EditArticle />} /> 

          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;