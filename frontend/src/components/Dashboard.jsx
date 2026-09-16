import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Bienvenido, {user.email || 'Usuario'}</h2>
        <p><strong>Rol:</strong> {user.role}</p>
        
        {user.role === 'profesor' && (
          <Link to="/profesor" style={styles.link}>
            Ir al Panel de Profesor →
          </Link>
        )}
        
        {user.role === 'estudiante' && (
          <Link to="/estudiante" style={styles.link}>
            Ir al Panel de Estudiante →
          </Link>
        )}
        
        <button onClick={logout} style={styles.button}>
          Cerrar Sesión
        </button>
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
  card: {
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 10px 28px rgba(22, 101, 52, 0.12)',
    textAlign: 'center',
    border: '1px solid #b7dfc2',
    maxWidth: '420px',
    width: '100%'
  },
  link: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#238b45',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    marginRight: '1rem',
    fontWeight: 600
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#166534',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600
  }
};