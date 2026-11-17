const ESTADOS_PILOTO = ['activo', 'inactivo', 'suspendido'];

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isPositiveInt = (v) => Number.isInteger(v) && v > 0;
const isValidDate = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));


const pilotRules = {
  nombre: { check: isText, msg: 'nombre debe ser un texto no vacío' },
  licencia: { check: isText, msg: 'licencia debe ser un texto no vacío' },
  horasVuelo: { check: (v) => typeof v === 'number' && v >= 0, msg: 'horasVuelo debe ser un número mayor o igual a 0' },
  estado: { check: (v) => ESTADOS_PILOTO.includes(v), msg: `estado debe ser uno de: ${ESTADOS_PILOTO.join(', ')}` },
};

const airplaneRules = {
  modelo: { check: isText, msg: 'modelo debe ser un texto no vacío' },
  matricula: { check: isText, msg: 'matricula debe ser un texto no vacío' },
  capacidadMaxima: { check: isPositiveInt, msg: 'capacidadMaxima debe ser un entero mayor a 0' },
  fabricante: { check: isText, msg: 'fabricante debe ser un texto no vacío' },
};

const assignmentRules = {
  idPiloto: { check: isPositiveInt, msg: 'idPiloto debe ser un entero mayor a 0' },
  idAvion: { check: isPositiveInt, msg: 'idAvion debe ser un entero mayor a 0' },
  fechaVuelo: { check: isValidDate, msg: 'fechaVuelo debe ser una fecha válida (ej. 2026-12-01)' },
  rutaAsignada: { check: isText, msg: 'rutaAsignada debe ser un texto no vacío' },
};


const buildBodyValidator = (rules, { partial = false } = {}) => (req, res, next) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'El cuerpo de la petición (JSON) es obligatorio' });
  }

  const errors = [];
  for (const [field, { check, msg }] of Object.entries(rules)) {
    if (body[field] === undefined) {
      if (!partial) errors.push(`El campo ${field} es obligatorio`);
      continue;
    }
    if (!check(body[field])) errors.push(msg);
  }

  if (errors.length > 0) return res.status(400).json({ error: errors.join('; '), detalles: errors });
  return next();
};


const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id de la URL debe ser un entero mayor a 0' });
  }
  return next();
};

module.exports = {
  validateId,
  validatePilot: buildBodyValidator(pilotRules),
  validatePilotUpdate: buildBodyValidator(pilotRules, { partial: true }),
  validateAirplane: buildBodyValidator(airplaneRules),
  validateAirplaneUpdate: buildBodyValidator(airplaneRules, { partial: true }),
  validateAssignment: buildBodyValidator(assignmentRules),
  validateAssignmentUpdate: buildBodyValidator(assignmentRules, { partial: true }),
};
