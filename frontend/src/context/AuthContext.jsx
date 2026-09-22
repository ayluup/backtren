import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const normalizeRole = (role) => {
  const cleanRole = String(role || '').trim().toUpperCase();

  if (cleanRole === 'PROFESSOR') return 'profesor';
  if (cleanRole === 'STUDENT') return 'estudiante';

  return cleanRole.toLowerCase();
};

const getUserFromToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    return {
      id: decoded.id,
      role: normalizeRole(decoded.role),
    };
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://localhost:3000/api/users/login', {
        email,
        password,
      });

      const token = response.data.token;
      if (!token) {
        return false;
      }

      const userFromToken = getUserFromToken(token);
      if (!userFromToken) {
        return false;
      }

      const loggedUser = {
        ...userFromToken,
        email,
      };

      setUser(loggedUser);
      localStorage.setItem('token', token);
      return loggedUser.role;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);