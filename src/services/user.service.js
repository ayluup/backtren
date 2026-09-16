
import bcrypt from "bcrypt";
import pool from "../database.js";

const MAX_LOGIN_ATTEMPTS = 10;

const normalizeRole = (role) => {
  const normalizedRole = String(role || "").trim().toUpperCase();

  if (!["PROFESSOR", "STUDENT"].includes(normalizedRole)) {
    throw new Error("El rol debe ser PROFESSOR o STUDENT.");
  }

  return normalizedRole;
};

export const createUserService = async ({ name, email, password, role }) => {
  const normalizedRole = normalizeRole(role);
  const passwordHash = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role,
      failed_login_attempts,
      locked
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, role, created_at
  `;

  const values = [name, email, passwordHash, normalizedRole, 0, false];

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
  const normalizedRole = normalizeRole(role);
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

  const values = [name, email, normalizedRole, id];

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

export const loginService = async (email, password) => {
  const query = `
    SELECT
      id,
      name,
      email,
      password_hash,
      role,
      failed_login_attempts,
      locked
    FROM users
    WHERE email = $1
      AND deleted_at IS NULL
  `;

  const { rows } = await pool.query(query, [email]);

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0];

  if (user.locked || user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS) {
    return { estado: "bloqueado" };
  }

  const passwordCorrecta = await bcrypt.compare(password, user.password_hash);

  if (!passwordCorrecta) {
    const { rows: attemptRows } = await pool.query(
      `UPDATE users
       SET failed_login_attempts = failed_login_attempts + 1,
           locked = failed_login_attempts + 1 >= $2
       WHERE id = $1
       RETURNING failed_login_attempts, locked`,
      [user.id, MAX_LOGIN_ATTEMPTS]
    );

    const attempts = attemptRows[0];

    return {
      estado: attempts.locked ? "bloqueado" : "incorrecto",
      intentosRestantes: Math.max(MAX_LOGIN_ATTEMPTS - attempts.failed_login_attempts, 0),
    };
  }

  await pool.query(
    `UPDATE users SET failed_login_attempts = 0 WHERE id = $1`,
    [user.id]
  );

  return user;
};