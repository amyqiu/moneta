const Observation = require('../models/observation');
const Patient = require('../models/patient');
const { validationResult, body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'observation_create': {
     return [
        body('patient_ID').exists().isString(),
        body('start_time').exists().isInt(),
      ]
    }
    case 'observation_end': {
     return [
        body('id').exists().isString(),
        body('patient_ID').exists().isString(),
        body('end_time').exists().isInt(),
      ]
    }
  }
}

exports.observation_create = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let observation;
  try {
    observation = new Observation(
      {
        patient_ID: req.body.patient_ID,
        start_time: new Date(req.body.start_time * 1000),
        entries: [],
      }
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

  Patient.findById(req.body.patient_ID, function (patientErr, patient) {
    if (patientErr) {
      return res.status(500).send(patientErr);
    }
    patient.observation_periods.push(observation.id);
    const patientUpdate = {
      in_observation: true,
      observation_periods: patient.observation_periods,
    }
    Patient.findByIdAndUpdate(req.body.patient_ID, {$set: patientUpdate}, function (updateErr, updatedPatient) {
      if (updateErr) {
        return res.status(500).send(updateErr);
      }
      observation.save(function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send('Observation created successfully');
      });
    });
  });
};

exports.observation_end = function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const update = {
    end_time: new Date(req.body.end_time * 1000),
  }
  Observation.findByIdAndUpdate(req.body.id, {$set: update}, function (err, obs) {
    if (err) {
      return res.status(500).send(err);
    } else if (!obs) {
      return res.status(500).send("Could not find observation");
    } else if (obs.patient_ID !== req.body.patient_ID){
      return res.status(500).send("Incorrect patient ID for the observation");
    }
    const patientUpdate = {
      in_observation: false,
    }
    Patient.findByIdAndUpdate(req.body.patient_ID, {$set: patientUpdate}, function (updateErr, updatedPatient) {
      if (updateErr) {
        return res.status(500).send(updateErr);
      } else if (!updatedPatient) {
        return res.status(500).send("Could not find patient");
      }
      return res.status(200).send('Observation ended successfully');
    });
  });
};

exports.observation_find_all = function (req, res) {
  Observation.find(function (err, observations) {
    if (err) {
      return res.status(500).send(err);
    };
    return res.status(200).send(observations);
  });
}

exports.observation_details = function (req, res) {
  Observation.
    findById(req.params.id).
    exec(function (err, obs) {
      if (err) {
        return res.status(500).send(err);
      } else if (!obs) {
        return res.status(500).send("Could not find observation");
      }
      return res.status(200).send(obs);
    });
};

exports.observation_delete = function (req, res) {
  Observation.findById(req.params.id, function (err, obs) {
    if (err) {
      return res.status(500).send(err);
    } else if (!obs) {
      return res.status(500).send('Could not find observation');
    }
    Patient.findByIdAndUpdate(obs.patient_ID, { $pullAll: { observation_periods: [obs.id] } }, {}, function(patientErr){
      if (patientErr) {
        return res.status(500).send(patientErr);
      }
      obs.remove(function (delErr) {
        if (delErr) {
          return res.status(500).send(delErr);
        }
        return res.status(200).send('Observation deleted successfully');
      });
    });
  });
};
