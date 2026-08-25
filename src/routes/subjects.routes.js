import { Router } from "express";

import {
  listSubjects,
  createNewSubject,
  editSubject,
  removeSubject,
  subjectDetail,
} from "../controllers/subjects.controller.js";
import { verificarToken, permitirRoles } from "../security/auth.js";

const router = Router();

/**
 * @openapi
 * /subjects:
 *   get:
 *     tags: [Subjects]
 *     summary: Listar materias
 *     responses:
 *       200:
 *         description: Lista de materias obtenida correctamente
 *   post:
 *     tags: [Subjects]
 *     summary: Crear una materia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, professor_id]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               professor_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Materia creada correctamente
 */
router.get("/", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), listSubjects);
router.post("/", verificarToken, permitirRoles("PROFESSOR"), createNewSubject);

/**
 * @openapi
 * /subjects/{id}:
 *   put:
 *     tags: [Subjects]
 *     summary: Actualizar una materia
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               professor_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Materia actualizada correctamente
 *   delete:
 *     tags: [Subjects]
 *     summary: Eliminar una materia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Materia eliminada correctamente
 */
router.put("/:id", verificarToken, permitirRoles("PROFESSOR"), editSubject);
router.delete("/:id", verificarToken, permitirRoles("PROFESSOR"), removeSubject);

/**
 * @openapi
 * /subjects/{id}/detail:
 *   get:
 *     tags: [Subjects]
 *     summary: Obtener detalle de una materia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la materia encontrado
 */
router.get("/:id/detail", verificarToken, permitirRoles("PROFESSOR", "STUDENT"), subjectDetail);

export default router;