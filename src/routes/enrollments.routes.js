import { Router } from "express";

import {
  listEnrollments,
  createNewEnrollment,
  editEnrollment,
  removeEnrollment,
} from "../controllers/enrollments.controllers.js";
import { verificarToken, permitirRoles } from "../security/auth.js";

const router = Router();

/**
 * @openapi
 * /enrollments:
 *   get:
 *     tags: [Enrollments]
 *     summary: Listar inscripciones
 *     responses:
 *       200:
 *         description: Lista de inscripciones obtenida correctamente
 *   post:
 *     tags: [Enrollments]
 *     summary: Crear una inscripción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [student_id, subject_id, grade]
 *             properties:
 *               student_id:
 *                 type: string
 *               subject_id:
 *                 type: string
 *               grade:
 *                 type: number
 *     responses:
 *       201:
 *         description: Inscripción creada correctamente
 */
router.get("/", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), listEnrollments);
router.post("/", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), createNewEnrollment);

/**
 * @openapi
 * /enrollments/{id}:
 *   put:
 *     tags: [Enrollments]
 *     summary: Actualizar una inscripción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *               subject_id:
 *                 type: string
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Inscripción actualizada correctamente
 *   delete:
 *     tags: [Enrollments]
 *     summary: Eliminar una inscripción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscripción eliminada correctamente
 */
router.put("/:id", verificarToken, permitirRoles("PROFESSOR"), editEnrollment);
router.delete("/:id", verificarToken, permitirRoles("PROFESSOR"), removeEnrollment);

export default router;