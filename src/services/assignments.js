const assignments = require('../data/assignments');
const pilots = require('../data/pilots');
const airplanes = require('../data/airplanes');

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const checkRelations = (idPiloto, idAvion) => {
  const pilot = pilots.find((p) => p.id === Number(idPiloto));
  if (!pilot) throw fail(`El piloto con id ${idPiloto} no existe`, 404);
  const airplane = airplanes.find((a) => a.id === Number(idAvion));
  if (!airplane) throw fail(`El avión con id ${idAvion} no existe`, 404);
  return { pilot, airplane };
};

const validDate = (value) => value && !Number.isNaN(Date.parse(value));

const getAll = () => assignments;

const getById = (id) => {
  const assignment = assignments.find((a) => a.idAsignacion === Number(id));
  if (!assignment) throw fail(`No existe una asignación con id ${id}`, 404);
  return assignment;
};

const create = (data) => {
  if (data.idPiloto === undefined) throw fail('idPiloto es obligatorio');
  if (data.idAvion === undefined) throw fail('idAvion es obligatorio');
  if (!validDate(data.fechaVuelo)) throw fail('fechaVuelo es obligatoria y debe ser válida (ej. 2026-12-01)');
  if (!data.rutaAsignada) throw fail('rutaAsignada es obligatoria');

  const { pilot } = checkRelations(data.idPiloto, data.idAvion);
  if (pilot.estado !== 'activo') {
    throw fail(`El piloto ${pilot.nombre} no está activo (estado: ${pilot.estado})`, 409);
  }

  const nextId = assignments.reduce((max, a) => Math.max(max, a.idAsignacion), 0) + 1;
  const newAssignment = {
    idAsignacion: nextId,
    idPiloto: Number(data.idPiloto),
    idAvion: Number(data.idAvion),
    fechaVuelo: data.fechaVuelo,
    rutaAsignada: data.rutaAsignada,
  };
  assignments.push(newAssignment);
  return newAssignment;
};

const update = (id, data) => {
  const assignment = getById(id);
  if (data.fechaVuelo !== undefined && !validDate(data.fechaVuelo)) throw fail('fechaVuelo no es válida');
  checkRelations(
    data.idPiloto !== undefined ? data.idPiloto : assignment.idPiloto,
    data.idAvion !== undefined ? data.idAvion : assignment.idAvion
  );
  const { idAsignacion: _ignored, ...changes } = data;
  if (changes.idPiloto !== undefined) changes.idPiloto = Number(changes.idPiloto);
  if (changes.idAvion !== undefined) changes.idAvion = Number(changes.idAvion);
  Object.assign(assignment, changes);
  return assignment;
};

const remove = (id) => {
  const assignment = getById(id);
  assignments.splice(assignments.indexOf(assignment), 1);
  return assignment;
};

module.exports = { getAll, getById, create, update, remove };
