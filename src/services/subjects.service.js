import pool from "../database.js";

// Crear materia
export const createSubject = async (
  name,
  description,
  professor_id
) => {

  // Verificar que exista el profesor
  const professor = await pool.query(
    "SELECT id FROM users WHERE id = $1",
    [professor_id]
  );

  if (professor.rowCount === 0) {
    throw new Error(`No existe un usuario con id ${professor_id}`);
  }

  const query = `
    INSERT INTO subjects (
      name,
      description,
      professor_id
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    name,
    description,
    professor_id,
  ]);

  return rows[0];
};

// Listar materias
export const getSubjects = async () => {
  const query = `
    SELECT *
    FROM subjects
    WHERE deleted_at IS NULL
    ORDER BY id
  `;

  const { rows } = await pool.query(query);

  return rows;
};

// Editar materia
export const updateSubject = async (
  id,
  name,
  description,
  professor_id
) => {

  // Verificar que exista el profesor
  const professor = await pool.query(
    "SELECT id FROM users WHERE id = $1",
    [professor_id]
  );

  if (professor.rowCount === 0) {
    throw new Error(`No existe un usuario con id ${professor_id}`);
  }

  const query = `
    UPDATE subjects
    SET
      name = $1,
      description = $2,
      professor_id = $3
    WHERE id = $4
      AND deleted_at IS NULL
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    name,
    description,
    professor_id,
    id,
  ]);

  return rows[0];
};

// Soft Delete
export const deleteSubject = async (id) => {
  const query = `
    UPDATE subjects
    SET deleted_at = NOW()
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING *
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

// Detalle de una materia
export const getSubjectDetail = async (id) => {
  const query = `
    SELECT *
    FROM subjects
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  return rows;
};