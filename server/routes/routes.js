var express = require('express');
var router = express.Router();

var patient_controller = require('../controllers/patient');
var entry_controller = require('../controllers/entry');

router.get('/patient/test', patient_controller.patient_test);

router.post('/patient/create', patient_controller.patient_create);

router.get('/patient/findall', patient_controller.patient_find_all);

router.get('/patient/:id', patient_controller.patient_details);

router.put('/patient/:id/update', patient_controller.patient_update);

router.delete('/patient/:id/delete', patient_controller.patient_delete);

router.get('/entry/test', entry_controller.entry_test);

router.post('/entry/create', entry_controller.entry_create);

router.get('/entry/findall', entry_controller.entry_find_all);

router.get('/entry/:id', entry_controller.entry_details);

router.put('/entry/:id/update', entry_controller.entry_update);

router.delete('/entry/:id/delete', entry_controller.entry_delete);

module.exports = router;
