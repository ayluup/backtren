import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

export default function Estudiante() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    try {
      const [subjectsRes, enrollmentsRes] = await Promise.all([
        axios.get(`${API}/api/subjects`, { headers }),
        axios.get(`${API}/api/enrollments`, { headers }),
      ]);

      setSubjects(subjectsRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
    } catch (error) {
      console.error('Error cargando datos del estudiante:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const enrolledSubjects = (subjects || []).filter((subject) =>
    (enrollments || []).some(
      (enrollment) =>
        enrollment.student_id === Number(user?.id) &&
        enrollment.subject_id === subject.id &&
        enrollment.deleted_at === null
    )
  );

  const availableSubjects = (subjects || []).filter(
    (subject) =>
      !(enrollments || []).some(
        (enrollment) =>
          enrollment.student_id === Number(user?.id) &&
          enrollment.subject_id === subject.id &&
          enrollment.deleted_at === null
      )
  );

  const handleInscription = async () => {
    if (!selectedSubjectId) {
      setMessage({ type: 'error', text: 'Seleccioná una materia para inscribirte' });
      return;
    }

    try {
      await axios.post(
        `${API}/api/enrollments`,
        {
          student_id: Number(user.id),
          subject_id: Number(selectedSubjectId),
          grade: null,
        },
        { headers }
      );

      setSelectedSubjectId('');
      setMessage({ type: 'success', text: 'Te inscribiste correctamente' });
      loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo inscribir en la materia' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Panel de Estudiante</h1>
        <button onClick={logout} style={styles.logout}>Cerrar Sesión</button>
      </div>

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

      <div style={styles.content}>
        <div style={styles.card}>
          <h3>Mis materias</h3>
          {enrolledSubjects.length === 0 ? (
            <p>No estás inscripto en ninguna materia todavía.</p>
          ) : (
            <div style={styles.list}>
              {enrolledSubjects.map((subject) => (
                <div key={subject.id} style={styles.subjectItem}>
                  <div style={styles.subjectHeader}>
                    <div style={{ flex: 1 }}>
                      <strong>{subject.name}</strong>
                      <span style={{ display: 'block' }}>{subject.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h3>Inscribirme</h3>
          <div style={styles.form}>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              style={styles.input}
            >
              <option value="">Seleccioná una materia</option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleInscription} style={styles.primaryButton}>
              Inscribirme
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Mi perfil</h3>
          <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
          <p><strong>Rol:</strong> Estudiante</p>
        </div>
      </div>

      <Link to="/dashboard" style={styles.back}>← Volver al Dashboard</Link>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#eaf7ef',
    padding: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  logout: {
    padding: '0.5rem 1rem',
    backgroundColor: '#166534',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  notice: {
    marginBottom: '1rem',
    padding: '0.75rem 1rem',
    border: '1px solid transparent',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  card: {
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(22, 101, 52, 0.10)',
    border: '1px solid #b7dfc2',
    color: '#14532d'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #a7d7b2',
    borderRadius: '10px',
    fontSize: '1rem',
    backgroundColor: '#f7fcf8',
    color: '#14532d'
  },
  primaryButton: {
    padding: '0.75rem',
    backgroundColor: '#238b45',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem'
  },
  subjectItem: {
    border: '1px solid #b7dfc2',
    borderRadius: '10px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    backgroundColor: '#f7fcf8'
  },
  subjectHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem'
  },
  back: {
    color: '#166534',
    textDecoration: 'none',
    fontWeight: 600
  }
};