import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Register from './pages/Register';

// Um componente simples para proteger rotas (opcional para agora, mas boa prática)
const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <--- Adicione aqui */}
        
        <Route 
          path="/professor" 
          element={
            <PrivateRoute>
              <ProfessorDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/aluno" 
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;