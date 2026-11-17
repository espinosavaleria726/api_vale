const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El JSON enviado está mal formado' });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
