const pilots = require('../data/pilots');
const assignments = require('../data/assignments');

const ESTADOS = ['activo', 'inactivo', 'suspendido'];

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getAll = () => pilots;

const getById = (id) => {
  const pilot = pilots.find((p) => p.id === Number(id));
  if (!pilot) throw fail(`No existe un piloto con id ${id}`, 404);
  return pilot;
};

const create = (data) => {
  if (!data.nombre) throw fail('El nombre es obligatorio');
  if (!data.licencia) throw fail('La licencia es obligatoria');
  if (data.horasVuelo === undefined || Number(data.horasVuelo) < 0 || Number.isNaN(Number(data.horasVuelo))) {
    throw fail('Las horas de vuelo deben ser un número mayor o igual a 0');
  }
  if (!ESTADOS.includes(data.estado)) throw fail(`El estado debe ser: ${ESTADOS.join(', ')}`);
  if (pilots.some((p) => p.licencia.toLowerCase() === String(data.licencia).toLowerCase())) {
    throw fail('Ya existe un piloto con esa licencia', 409);
  }

  const nextId = pilots.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const newPilot = {
    id: nextId,
    nombre: data.nombre,
    licencia: data.licencia,
    horasVuelo: Number(data.horasVuelo),
    estado: data.estado,
  };
  pilots.push(newPilot);
  return newPilot;
};

const update = (id, data) => {
  const pilot = getById(id);
  if (data.estado !== undefined && !ESTADOS.includes(data.estado)) {
    throw fail(`El estado debe ser: ${ESTADOS.join(', ')}`);
  }
  if (data.horasVuelo !== undefined && (Number.isNaN(Number(data.horasVuelo)) || Number(data.horasVuelo) < 0)) {
    throw fail('Las horas de vuelo deben ser un número mayor o igual a 0');
  }
  if (data.licencia !== undefined) {
    const dup = pilots.find((p) => p.licencia.toLowerCase() === String(data.licencia).toLowerCase());
    if (dup && dup.id !== pilot.id) throw fail('Ya existe un piloto con esa licencia', 409);
  }
  const { id: _ignored, ...changes } = data; // el id no se puede cambiar
  if (changes.horasVuelo !== undefined) changes.horasVuelo = Number(changes.horasVuelo);
  Object.assign(pilot, changes);
  return pilot;
};

const remove = (id) => {
  const pilot = getById(id);
  if (assignments.some((a) => a.idPiloto === pilot.id)) {
    throw fail('No se puede eliminar el piloto: tiene asignaciones registradas', 409);
  }
  pilots.splice(pilots.indexOf(pilot), 1);
  return pilot;
};

module.exports = { getAll, getById, create, update, remove };
