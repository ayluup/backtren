import {
  createEnrollment,
  getEnrollments,
  updateEnrollment,
  deleteEnrollment,
} from "../services/enrollments.service.js";

// Crear inscripción
export const createNewEnrollment = async (req, res) => {

  try {

    const { student_id, subject_id, grade } = req.body;

    const enrollment = await createEnrollment(
      student_id,
      subject_id,
      grade
    );

    res.status(201).json(enrollment);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Listar
export const listEnrollments = async (req, res) => {

  try {

    const enrollments = await getEnrollments();

    res.json(enrollments);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Editar
export const editEnrollment = async (req, res) => {

  try {

    const { id } = req.params;

    const { student_id, subject_id, grade } = req.body;

    const enrollment = await updateEnrollment(
      id,
      student_id,
      subject_id,
      grade
    );

    res.json(enrollment);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Eliminar
export const removeEnrollment = async (req, res) => {

  try {

    const { id } = req.params;

    const enrollment = await deleteEnrollment(id);

    res.json(enrollment);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};