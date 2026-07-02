import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  getSubjectDetail,
}from "../services/subjects.service.js";

// GET /subjects
export const listSubjects = async (req, res) => {
  try {
    const subjects = await getSubjects();

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /subjects
export const createNewSubject = async (req, res) => {
  try {
    const {
      name,
      description,
      professor_id,
    } = req.body;

    const subject = await createSubject(
      name,
      description,
      professor_id
    );

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /subjects/:id
export const editSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      professor_id,
    } = req.body;

    const subject = await updateSubject(
      id,
      name,
      description,
      professor_id
    );

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /subjects/:id
export const removeSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await deleteSubject(id);

    res.status(200).json({
      message: "Materia eliminada",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const subjectDetail=async(req,res)=>{

    try{

        const {id}=req.params;

        const data=await getSubjectDetail(id);

        res.json(data);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

}