import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profesor from './pages/Profesor';
import Estudiante from './pages/Estudiante';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/profesor" 
            element={
              <ProtectedRoute role="profesor">
                <Profesor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/estudiante" 
            element={
              <ProtectedRoute role="estudiante">
                <Estudiante />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;