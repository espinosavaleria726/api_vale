// middlewares/logger.js - Registra en consola cada petición que llega a la API.
// Formato: [fecha ISO] MÉTODO /ruta código duración

const logger = (req, res, next) => {
  const start = Date.now();

  // 'finish' se dispara cuando la respuesta ya se envió, así conocemos el código final
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

module.exports = logger;
