const Observation = require('../models/observation');
const Patient = require('../models/patient');

exports.observation_create = function (req, res) {
  const observation = new Observation(
    {
      patient_ID: req.body.patient_ID,
      start_time: new Date(req.body.start_time * 1000),
      entries: [],
    }
  );

  observation.save(function (err) {
    if (err) {
      res.send(err);
    }
    Patient.findById(req.body.patient_ID, function (patientErr, patient) {
      if (patientErr) {
        res.send(patientErr);
      }
      patient.observation_periods.push(observation.id);
      const patientUpdate = {
        in_observation: true,
        observation_periods: patient.observation_periods,
      }
      Patient.findByIdAndUpdate(req.body.patient_ID, {$set: patientUpdate}, function (updateErr, updatedPatient) {
        if (updateErr) {
          res.send(updateErr);
        }
        res.send('Observation created successfully');
      });
    });
  });
};

exports.observation_end = function (req, res) {
  const update = {
    end_time: new Date(req.body.end_time * 1000),
  }

  Observation.findByIdAndUpdate(req.body.id, {$set: update}, function (err, obs) {
    if (err) {
      res.send(err);
    }
    const patientUpdate = {
      in_observation: false,
    }
    Patient.findByIdAndUpdate(req.body.patient_ID, {$set: patientUpdate}, function (updateErr, updatedPatient) {
      if (updateErr) {
        res.send(updateErr);
      }
      res.send('Observation ended successfully');
    });
  });
};

exports.observation_find_all = function (req, res) {
  Observation.find(function (err, observations) {
    if (err) {
      res.send(err);
    };
    res.send(observations);
  });
}

exports.observation_details = function (req, res) {
  Observation.
    findById(req.params.id).
    // populate('observation_periods', 'start_time end_time').
    exec(function (err, obs) {
    if (err) {
      res.send(err);
    }
    res.send(obs);
  });
};

// Note: this doesn't delete the observation ID in the patient array
exports.observation_delete = function (req, res) {
  Observation.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Observation deleted successfully');
  });
};
