const airplanes = require('../data/airplanes');
const assignments = require('../data/assignments');

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getAll = () => airplanes;

const getById = (id) => {
  const airplane = airplanes.find((a) => a.id === Number(id));
  if (!airplane) throw fail(`No existe un avión con id ${id}`, 404);
  return airplane;
};

const create = (data) => {
  if (!data.modelo) throw fail('El modelo es obligatorio');
  if (!data.matricula) throw fail('La matrícula es obligatoria');
  if (!Number.isInteger(Number(data.capacidadMaxima)) || Number(data.capacidadMaxima) <= 0) {
    throw fail('La capacidad máxima debe ser un entero mayor a 0');
  }
  if (!data.fabricante) throw fail('El fabricante es obligatorio');
  if (airplanes.some((a) => a.matricula.toLowerCase() === String(data.matricula).toLowerCase())) {
    throw fail('Ya existe un avión con esa matrícula', 409);
  }

  const nextId = airplanes.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const newAirplane = {
    id: nextId,
    modelo: data.modelo,
    matricula: data.matricula,
    capacidadMaxima: Number(data.capacidadMaxima),
    fabricante: data.fabricante,
  };
  airplanes.push(newAirplane);
  return newAirplane;
};

const update = (id, data) => {
  const airplane = getById(id);
  if (data.capacidadMaxima !== undefined &&
      (!Number.isInteger(Number(data.capacidadMaxima)) || Number(data.capacidadMaxima) <= 0)) {
    throw fail('La capacidad máxima debe ser un entero mayor a 0');
  }
  if (data.matricula !== undefined) {
    const dup = airplanes.find((a) => a.matricula.toLowerCase() === String(data.matricula).toLowerCase());
    if (dup && dup.id !== airplane.id) throw fail('Ya existe un avión con esa matrícula', 409);
  }
  const { id: _ignored, ...changes } = data;
  if (changes.capacidadMaxima !== undefined) changes.capacidadMaxima = Number(changes.capacidadMaxima);
  Object.assign(airplane, changes);
  return airplane;
};

const remove = (id) => {
  const airplane = getById(id);
  if (assignments.some((a) => a.idAvion === airplane.id)) {
    throw fail('No se puede eliminar el avión: tiene asignaciones registradas', 409);
  }
  airplanes.splice(airplanes.indexOf(airplane), 1);
  return airplane;
};

module.exports = { getAll, getById, create, update, remove };
