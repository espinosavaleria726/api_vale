const { Router } = require('express');
const airplaneController = require('../controllers/airplanes');

const router = Router();

router.get('/', airplaneController.getAirplanes);
router.get('/:id', airplaneController.getAirplaneById);
router.post('/', airplaneController.createAirplane);
router.put('/:id', airplaneController.updateAirplane);
router.delete('/:id', airplaneController.deleteAirplane);

module.exports = router;
