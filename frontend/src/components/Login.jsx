import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate('/dashboard');
    } else {
      setMessage({ type: 'error', text: 'Email o contraseña incorrectos' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/users/register', {
        name,
        email,
        password,
        role,
      });

      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
        return;
      }

      setMessage({ type: 'success', text: 'Usuario creado correctamente. Inicia sesión manualmente' });
      setShowRegister(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('STUDENT');
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo crear el usuario' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {message.text && (
          <div
            style={{
              ...styles.notice,
              backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda',
              color: message.type === 'error' ? '#721c24' : '#155724',
              borderColor: message.type === 'error' ? '#f5c6cb' : '#c3e6cb',
            }}
          >
            {message.text}
          </div>
        )}

        {!showRegister ? (
          <div style={styles.card}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>
                Entrar
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowRegister(true)}
              style={styles.linkButton}
            >
              Crear cuenta nueva
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.title}>Crear usuario</h2>
            <form onSubmit={handleRegister} style={styles.form}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.input}
              >
                <option value="STUDENT">Estudiante</option>
                <option value="PROFESSOR">Profesor</option>
              </select>

              <button type="submit" style={styles.button}>
                Registrarse
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowRegister(false)}
              style={styles.linkButton}
            >
              Ya tengo cuenta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#eaf7ef'
  },
  wrapper: {
    width: '100%',
    maxWidth: '430px',
    padding: '1rem'
  },
  notice: {
    marginBottom: '1rem',
    padding: '0.75rem 1rem',
    border: '1px solid transparent',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  card: {
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 28px rgba(22, 101, 52, 0.12)',
    width: '100%',
    border: '1px solid #b7dfc2',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#166534'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #a7d7b2',
    borderRadius: '10px',
    fontSize: '1rem',
    backgroundColor: '#f7fcf8',
    color: '#14532d',
    outline: 'none'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#238b45',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 6px 14px rgba(35, 139, 69, 0.22)'
  },
  linkButton: {
    marginTop: '1rem',
    width: '100%',
    backgroundColor: '#f0faf3',
    color: '#166534',
    border: '1px solid #a7d7b2',
    borderRadius: '10px',
    padding: '0.75rem',
    cursor: 'pointer',
    fontWeight: 600
  }
};