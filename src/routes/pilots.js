const { Router } = require('express');
const pilotController = require('../controllers/pilots');

const router = Router();

router.get('/', pilotController.getPilots);
router.get('/:id', pilotController.getPilotById);
router.post('/', pilotController.createPilot);
router.put('/:id', pilotController.updatePilot);
router.delete('/:id', pilotController.deletePilot);

module.exports = router;
