// controllers/pilots.js - Capa HTTP: lee req, llama al servicio y responde con res
const pilotService = require('../services/pilots');

// Los errores de negocio traen su código; los inesperados son 500
const handleError = (res, error) => {
  const status = error.status || 500;
  return res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
};

const getPilots = (req, res) => {
  try {
    return res.status(200).json(pilotService.getAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const getPilotById = (req, res) => {
  try {
    return res.status(200).json(pilotService.getById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const createPilot = (req, res) => {
  try {
    return res.status(201).json(pilotService.create(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const updatePilot = (req, res) => {
  try {
    return res.status(200).json(pilotService.update(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const deletePilot = (req, res) => {
  try {
    pilotService.remove(req.params.id);
    return res.status(200).json({ mensaje: 'Piloto eliminado correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getPilots, getPilotById, createPilot, updatePilot, deletePilot };
