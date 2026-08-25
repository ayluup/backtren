import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  getProfessorByIdService,
  getStudentByIdService,
} from "../services/user.service.js";
import { generarToken } from "../security/jwt.js";
import { loginService } from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || String(error),
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message || String(error),
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await updateUserService(id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await deleteUserService(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await getProfessorByIdService(id);

    if (!professor) {
      return res.status(404).json({
        message: "Profesor no encontrado"
      });
    }

    res.json(professor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await getStudentByIdService(id);

    if (!student) {
      return res.status(404).json({
        message: "Estudiante no encontrado"
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const user = await loginService(email, password);

    if (!user) {
      return res.status(401).json({
        message: "Email o contraseña incorrectos",
      });
    }

    if (user.estado === "bloqueado") {
      return res.status(423).json({
        message: "Cuenta bloqueada después de 10 intentos fallidos",
      });
    }

    if (user.estado === "incorrecto") {
      return res.status(401).json({
        message: "Email o contraseña incorrectos",
        intentosRestantes: user.intentosRestantes,
      });
    }

    const token = generarToken(user);

    res.status(200).json({
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};