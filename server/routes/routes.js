const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patient');
const observationController = require('../controllers/observation');
const entryController = require('../controllers/entry');

// Patient routes
router.get('/patient/test', patientController.patient_test);
router.post('/patient/create', patientController.validate('patient_create'), patientController.patient_create);
router.get('/patient/findall', patientController.patient_find_all);
router.get('/patient/find-days-with-entries', patientController.find_days_with_entries);
router.get('/patient/last-entry-time', patientController.last_entry_time);
router.get('/patient/:id', patientController.patient_details);
router.put('/patient/:id/update', patientController.patient_update);
router.delete('/patient/:id/delete', patientController.patient_delete);

// Observation routes
router.post('/observation/create', observationController.validate('observation_create'), observationController.observation_create);
router.post('/observation/end', observationController.validate('observation_end'), observationController.observation_end);
router.get('/observation/findall', observationController.observation_find_all);
router.get('/observation/get-correlations', observationController.observation_get_correlations);
router.get('/observation/:id', observationController.observation_details);
router.put('/observation/:id/update', observationController.observation_update);
router.delete('/observation/:id/delete', observationController.observation_delete);

// Entry routes
router.get('/entry/test', entryController.entry_test);
router.post('/entry/create', entryController.validate('entry_create'), entryController.entry_create);
router.get('/entry/findall', entryController.entry_find_all);
router.get('/entry/find-entries-on-day', entryController.entry_find_day);
router.get('/entry/:id', entryController.entry_details);
router.put('/entry/:id/update', entryController.entry_update);
router.delete('/entry/:id/delete', entryController.entry_delete);

module.exports = router;
