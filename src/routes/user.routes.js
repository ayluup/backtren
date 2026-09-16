import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfessorById,
  getStudentById,
} from "../controllers/user.controller.js";

import { login } from "../controllers/user.controller.js";
import { verificarToken, permitirRoles } from "../security/auth.js";

const router = Router();

router.get("/", verificarToken, permitirRoles("PROFESSOR"), getAllUsers);

router.get("/professor/:id", verificarToken, permitirRoles("PROFESSOR"), getProfessorById);
router.get("/student/:id", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), getStudentById);

router.get("/:id", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), getUserById);

router.post("/register", createUser);
router.post("/", verificarToken, permitirRoles("PROFESSOR"), createUser);
router.put("/:id", verificarToken, permitirRoles("PROFESSOR"), updateUser);
router.delete("/:id", verificarToken, permitirRoles("PROFESSOR"), deleteUser);
router.post("/login", login);

export default router;