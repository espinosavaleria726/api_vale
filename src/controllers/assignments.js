const assignmentService = require('../services/assignments');

const handleError = (res, error) => {
  const status = error.status || 500;
  return res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
};

const getAssignments = (req, res) => {
  try {
    return res.status(200).json(assignmentService.getAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const getAssignmentById = (req, res) => {
  try {
    return res.status(200).json(assignmentService.getById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const createAssignment = (req, res) => {
  try {
    return res.status(201).json(assignmentService.create(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const updateAssignment = (req, res) => {
  try {
    return res.status(200).json(assignmentService.update(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteAssignment = (req, res) => {
  try {
    assignmentService.remove(req.params.id);
    return res.status(200).json({ mensaje: 'Asignación eliminada correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getAssignments, getAssignmentById, createAssignment, updateAssignment, deleteAssignment };
