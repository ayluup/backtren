import pool from "../database.js";

export const checkHealth = () => {
  return {
    status: "ok",
    message: "API running",
    timestamp: new Date().toISOString(),
  };
};

export const checkDbHealth = async () => {
  try {
    await pool.query("SELECT 1");

    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      database: "disconnected",
      error: {
        message: error.message,
        code: error.code || null,
      },
      timestamp: new Date().toISOString(),
    };
  }
};