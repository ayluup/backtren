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

const router = Router();

router.get("/", getAllUsers);

router.get("/professor/:id", getProfessorById);
router.get("/student/:id", getStudentById);


router.get("/:id", getUserById);

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;