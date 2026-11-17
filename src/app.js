const express = require('express');

const pilotRoutes = require('./routes/pilots');
const airplaneRoutes = require('./routes/airplanes');
const assignmentRoutes = require('./routes/assignments');

const app = express();

app.use(express.json());

app.use('/api/pilotos', pilotRoutes);
app.use('/api/aviones', airplaneRoutes);
app.use('/api/asignaciones', assignmentRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
