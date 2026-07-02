import pool from "../database.js";

// Crear inscripción
export const createEnrollment = async (
  student_id,
  subject_id,
  grade
) => {
  const query = `
    INSERT INTO enrollments (student_id, subject_id, grade)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    student_id,
    subject_id,
    grade,
  ]);

  return rows[0];
};

// Listar inscripciones
export const getEnrollments = async () => {
  const query = `
    SELECT *
    FROM enrollments
    WHERE deleted_at IS NULL
    ORDER BY id
  `;

  const { rows } = await pool.query(query);

  return rows;
};

// Editar inscripción
export const updateEnrollment = async (
  id,
  student_id,
  subject_id,
  grade
) => {
  const query = `
    UPDATE enrollments
    SET
      student_id = $1,
      subject_id = $2,
      grade = $3
    WHERE id = $4
      AND deleted_at IS NULL
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    student_id,
    subject_id,
    grade,
    id,
  ]);

  return rows[0];
};

// Soft Delete
export const deleteEnrollment = async (id) => {
  const query = `
    UPDATE enrollments
    SET deleted_at = NOW()
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING *
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};