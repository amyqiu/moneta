const Patient = require('../models/patient');

//TODO: Add endpoints for getting entries for a day + days with entries

// Test url
exports.patient_test = function (req, res) {
  return res.status(200).send('Greetings from the patient test controller!');
};

exports.patient_create = function (req, res) {
  const patient = new Patient(
    {
      name: req.body.name,
      age: req.body.age,
      room: req.body.room,
      profile_picture: req.body.profile_picture,
      observation_periods: req.body.observation_periods,
      in_observation: req.body.in_observation
    }
  );

  patient.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Patient created successfully');
  })
};

exports.patient_find_all = function (req, res) {
  Patient.
    find().
    populate('observation_periods', 'start_time end_time').
    exec(function (err, patients) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(patients);
    });
}

exports.patient_details = function (req, res) {
  Patient.
    findById(req.params.id).
    populate('observation_periods', 'start_time end_time').
    exec(function (err, patient) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(patient);
    });
};

exports.patient_update = function (req, res) {
  Patient.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, patient) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Patient updated');
  });
};

exports.patient_delete = function (req, res) {
  Patient.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Patient deleted successfully');
  });
};
