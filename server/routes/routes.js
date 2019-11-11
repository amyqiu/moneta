const express = require('express');
const router = express.Router();

const patient_controller = require('../controllers/patient');
const observation_controller = require('../controllers/observation')
const entry_controller = require('../controllers/entry');

const { check, validationResult } = require('express-validator');

// Patient routes
router.get('/patient/test', patient_controller.patient_test);
router.post('/patient/create', patient_controller.validate('patient_create'), patient_controller.patient_create);
router.get('/patient/findall', patient_controller.patient_find_all);
router.get('/patient/:id', patient_controller.patient_details);
router.put('/patient/:id/update', patient_controller.patient_update);
router.delete('/patient/:id/delete', patient_controller.patient_delete);
router.get('/patient/:id/:month/:year/get_days_with_entries', patient_controller.get_days_with_entries);

// Observation routes
router.post('/observation/create', observation_controller.validate('observation_create'), observation_controller.observation_create);
router.post('/observation/end', observation_controller.validate('observation_end'), observation_controller.observation_end);
router.get('/observation/findall', observation_controller.observation_find_all);
router.get('/observation/:id', observation_controller.observation_details);
router.put('/observation/:id/update', observation_controller.observation_update);
router.delete('/observation/:id/delete', observation_controller.observation_delete);

// Entry routes
router.get('/entry/test', entry_controller.entry_test);
router.post('/entry/create', entry_controller.validate('entry_create'), entry_controller.entry_create);
router.get('/entry/findall', entry_controller.entry_find_all);
router.get('/entry/:id', entry_controller.entry_details);
router.put('/entry/:id/update', entry_controller.entry_update);
router.delete('/entry/:id/delete', entry_controller.entry_delete);

module.exports = router;
