var express = require('express');
var router = express.Router();

var patient_controller = require('../controllers/patient');

router.get('/test', patient_controller.test);

router.post('/create', patient_controller.patient_create);

router.get('/:id', patient_controller.patient_details);

router.put('/:id/update', patient_controller.patient_update);

router.delete('/:id/delete', patient_controller.patient_delete);

module.exports = router;
