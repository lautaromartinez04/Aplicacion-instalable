import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from './routes/components/NavBar';
import { Footer } from './routes/components/Footer';
import { LoginScreen } from './routes/LoginScreen';
import { InicioScreen } from './routes/InicioScreen';
import { UsuariosScreen } from './routes/UsuariosScreen';
import { AnalisisScreen } from './routes/AnalisisScreen';
import { TransporteScreen } from './routes/TransporteScreen';
import { ClientesScreen } from './routes/ClientesScreen';
import { ReportesScreen } from './routes/ReportesScreen';

// Función para verificar si el token (JWT) está expirado
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) {
      // payload.exp viene en segundos; se multiplica por 1000 para compararlo con Date.now()
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch (error) {
    return true;
  }
};

export const App = () => {
  // Estado para saber si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para chequear el token y actualizar la autenticación
  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Chequeo inicial del token
    checkToken();
    // Establecemos un intervalo para revisar el token cada 60 segundos (puedes ajustar el tiempo)
    const intervalId = setInterval(checkToken, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    // Eliminar el token y actualizar el estado
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <NavBar handleLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <div style={{ minHeight: '67.4vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <InicioScreen /> : <Navigate to="/login" />} />
          <Route path="/Inicio" element={isAuthenticated ? <InicioScreen /> : <Navigate to="/login" />} />
          <Route path="/Usuarios" element={isAuthenticated ? <UsuariosScreen /> : <Navigate to="/login" />} />
          <Route path="/Analisis" element={isAuthenticated ? <AnalisisScreen /> : <Navigate to="/login" />} />
          <Route path="/Transporte" element={isAuthenticated ? <TransporteScreen /> : <Navigate to="/login" />} />
          <Route path="/Clientes" element={isAuthenticated ? <ClientesScreen /> : <Navigate to="/login" />} />
          <Route path="/Reportes" element={isAuthenticated ? <ReportesScreen /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginScreen setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};
