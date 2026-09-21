import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://192.168.1.40:3000';

export default function Profesor() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectDescription, setEditSubjectDescription] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    try {
      const [subjectsRes, usersRes, enrollmentsRes] = await Promise.all([
        axios.get(`${API}/api/subjects`, { headers }),
        axios.get(`${API}/api/users`, { headers }),
        axios.get(`${API}/api/enrollments`, { headers }),
      ]);

      setSubjects(subjectsRes.data || []);
      setStudents((usersRes.data || []).filter((u) => u.role === 'STUDENT'));
      setEnrollments(enrollmentsRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/api/subjects`,
        {
          name: subjectName,
          description: subjectDescription,
          professor_id: user.id,
        },
        { headers }
      );

      setSubjectName('');
      setSubjectDescription('');
      setMessage({ type: 'success', text: 'Materia creada correctamente' });
      loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo crear la materia' });
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();

    if (!selectedSubject) return;

    try {
      await axios.put(
        `${API}/api/subjects/${selectedSubject.id}`,
        {
          name: editSubjectName,
          description: editSubjectDescription,
          professor_id: user.id,
        },
        { headers }
      );

      setSelectedSubject(null);
      setEditSubjectName('');
      setEditSubjectDescription('');
      setMessage({ type: 'success', text: 'Materia actualizada' });
      loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo actualizar la materia' });
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await axios.delete(`${API}/api/subjects/${subjectId}`, { headers });
      setMessage({ type: 'success', text: 'Materia eliminada' });
      loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo eliminar la materia' });
    }
  };

  const startEditingSubject = (subject) => {
    setSelectedSubject(subject);
    setEditSubjectName(subject.name);
    setEditSubjectDescription(subject.description || '');
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjectId((current) => (current === subjectId ? null : subjectId));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Panel de Profesor</h1>
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

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>{selectedSubject ? 'Editar materia' : 'Crear materia'}</h3>
          <form onSubmit={selectedSubject ? handleUpdateSubject : handleCreateSubject} style={styles.form}>
            <input
              type="text"
              placeholder="Nombre de la materia"
              value={selectedSubject ? editSubjectName : subjectName}
              onChange={(e) => selectedSubject ? setEditSubjectName(e.target.value) : setSubjectName(e.target.value)}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Descripción"
              value={selectedSubject ? editSubjectDescription : subjectDescription}
              onChange={(e) => selectedSubject ? setEditSubjectDescription(e.target.value) : setSubjectDescription(e.target.value)}
              style={{ ...styles.input, minHeight: '90px' }}
              required
            />
            <div style={styles.inlineButtons}>
              <button type="submit" style={styles.primaryButton}>
                {selectedSubject ? 'Guardar cambios' : 'Guardar materia'}
              </button>
              {selectedSubject && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject(null);
                    setEditSubjectName('');
                    setEditSubjectDescription('');
                  }}
                  style={styles.secondaryButton}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Materias</h3>
          <div style={styles.list}>
            {subjects.length === 0 ? (
              <p>No hay materias creadas.</p>
            ) : (
              subjects.map((subject) => {
                const subjectStudents = students.filter((student) =>
                  (enrollments || []).some(
                    (enrollment) =>
                      enrollment.subject_id === subject.id &&
                      enrollment.student_id === student.id &&
                      enrollment.deleted_at === null
                  )
                );

                return (
                  <div key={subject.id} style={styles.item}>
                    <div style={styles.itemHeader}>
                      <strong>{subject.name}</strong>
                      <div style={styles.inlineButtons}>
                        <button type="button" onClick={() => toggleSubject(subject.id)} style={styles.secondaryButton}>
                          {expandedSubjectId === subject.id ? 'Ocultar alumnos' : 'Ver alumnos'}
                        </button>
                        <button type="button" onClick={() => startEditingSubject(subject)} style={styles.secondaryButton}>Editar</button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(subject.id)}
                          style={styles.dangerButton}
                          aria-label={`Eliminar materia ${subject.name}`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <span>{subject.description}</span>

                    {expandedSubjectId === subject.id && (
                      <div style={{ marginTop: '0.75rem' }}>
                        {subjectStudents.length === 0 ? (
                          <p style={{ margin: 0 }}>No hay alumnos inscriptos en esta materia.</p>
                        ) : (
                          <div style={styles.list}>
                            {subjectStudents.map((student) => (
                              <div key={student.id} style={styles.studentRow}>
                                <div style={{ flex: 1 }}>
                                  <strong>{student.name}</strong>
                                  <div>{student.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/dashboard" style={styles.back}>← Volver al Dashboard</Link>
      </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
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
  secondaryButton: {
    padding: '0.5rem 0.8rem',
    backgroundColor: '#2f855a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  dangerButton: {
    padding: '0.5rem 0.8rem',
    backgroundColor: '#be123c',
    color: 'white',
    border: '1px solid #9f1239',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },
  inlineButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem'
  },
  item: {
    border: '1px solid #b7dfc2',
    borderRadius: '10px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    backgroundColor: '#f7fcf8'
  },
  itemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem'
  },
  studentRow: {
    border: '1px solid #b7dfc2',
    borderRadius: '10px',
    padding: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    backgroundColor: '#f7fcf8'
  },
  back: {
    color: '#166534',
    textDecoration: 'none',
    fontWeight: 600
  }
};