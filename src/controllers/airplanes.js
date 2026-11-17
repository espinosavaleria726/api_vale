const airplaneService = require('../services/airplanes');

const handleError = (res, error) => {
  const status = error.status || 500;
  return res.status(status).json({ error: status === 500 ? 'Error interno del servidor' : error.message });
};

const getAirplanes = (req, res) => {
  try {
    return res.status(200).json(airplaneService.getAll());
  } catch (error) {
    return handleError(res, error);
  }
};

const getAirplaneById = (req, res) => {
  try {
    return res.status(200).json(airplaneService.getById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const createAirplane = (req, res) => {
  try {
    return res.status(201).json(airplaneService.create(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const updateAirplane = (req, res) => {
  try {
    return res.status(200).json(airplaneService.update(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteAirplane = (req, res) => {
  try {
    airplaneService.remove(req.params.id);
    return res.status(200).json({ mensaje: 'Avión eliminado correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getAirplanes, getAirplaneById, createAirplane, updateAirplane, deleteAirplane };
