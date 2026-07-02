
import bcrypt from "bcrypt";
import pool from "../database.js";
export const createUserService = async ({ name, email, password, role }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
  `;

  const values = [name, email, passwordHash, role];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const getAllUsersService = async () => {
  const query = `
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE deleted_at IS NULL
    ORDER BY id
  `;

  const { rows } = await pool.query(query);

  return rows;
};

export const updateUserService = async (id, { name, email, role }) => {
  const query = `
    UPDATE users
    SET
      name = $1,
      email = $2,
      role = $3
    WHERE id = $4
      AND deleted_at IS NULL
    RETURNING
      id,
      name,
      email,
      role,
      updated_at
  `;

  const values = [name, email, role, id];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const deleteUserService = async (id) => {
  const query = `
    UPDATE users
    SET deleted_at = NOW()
    WHERE id = $1
      AND deleted_at IS NULL
    RETURNING id
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};

export const getUserByIdService = async (id) => {
  const query = `
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
      AND deleted_at IS NULL
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0];
};
export const getProfessorByIdService = async (id) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
      AND role = 'PROFESSOR'
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
export const getStudentByIdService = async (id) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
      AND role = 'STUDENT'
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};