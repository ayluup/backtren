import { Router } from "express";

import {
  listEnrollments,
  createNewEnrollment,
  editEnrollment,
  removeEnrollment,
} from "../controllers/enrollments.controllers.js";

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
router.get("/", listEnrollments);
router.post("/", createNewEnrollment);

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
router.put("/:id", editEnrollment);
router.delete("/:id", removeEnrollment);

export default router;