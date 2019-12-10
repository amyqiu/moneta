const { validationResult, body } = require('express-validator/check');
const Observation = require('../models/observation');
const Patient = require('../models/patient');

exports.validate = (method) => {
  switch (method) {
    case 'observation_create': {
      return [
        body('patient_ID').exists().isString(),
        body('start_time').exists().isInt(),
      ];
    }
    case 'observation_end': {
      return [
        body('id').exists().isString(),
        body('patient_ID').exists().isString(),
        body('end_time').exists().isInt(),
      ];
    } default: {
      return [];
    }
  }
};

exports.observation_create = (req, res) => {
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
      },
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

  Patient.findById(req.body.patient_ID, (patientErr, patient) => {
    if (patientErr) {
      return res.status(500).send(patientErr);
    }
    patient.observation_periods.push(observation.id);
    const patientUpdate = {
      in_observation: true,
      observation_periods: patient.observation_periods,
    };
    Patient.findByIdAndUpdate(req.body.patient_ID, { $set: patientUpdate }, (updateErr) => {
      if (updateErr) {
        return res.status(500).send(updateErr);
      }
      observation.save((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send({
          message: 'Observation created successfully',
          observation: observation.id,
        });
      });
    });
  });
};

exports.observation_end = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const update = {
    end_time: new Date(req.body.end_time * 1000),
  };
  Observation.findByIdAndUpdate(req.body.id, { $set: update }, (err, obs) => {
    if (err) {
      return res.status(500).send(err);
    } if (!obs) {
      return res.status(500).send('Could not find observation');
    } if (obs.patient_ID !== req.body.patient_ID) {
      return res.status(500).send('Incorrect patient ID for the observation');
    }
    const patientUpdate = {
      in_observation: false,
    };
    Patient.findByIdAndUpdate(req.body.patient_ID,
      { $set: patientUpdate },
      (updateErr, updatedPatient) => {
        if (updateErr) {
          return res.status(500).send(updateErr);
        } if (!updatedPatient) {
          return res.status(500).send('Could not find patient');
        }
        return res.status(200).send('Observation ended successfully');
      });
  });
};

exports.observation_find_all = (req, res) => {
  Observation.find((err, observations) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send(observations);
  });
};

exports.observation_details = (req, res) => {
  Observation
    .findById(req.params.id)
    .exec((err, obs) => {
      if (err) {
        return res.status(500).send(err);
      } if (!obs) {
        return res.status(500).send('Could not find observation');
      }
      return res.status(200).send(obs);
    });
};

exports.observation_update = (req, res) => {
  Observation.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, obs) => {
    if (err) {
      return res.status(500).send(err);
    } if (!obs) {
      return res.status(500).send('Observation does not exist');
    }
    return res.status(200).send('Observation updated');
  });
};

exports.observation_delete = (req, res) => {
  Observation.findById(req.params.id, (err, obs) => {
    if (err) {
      return res.status(500).send(err);
    } if (!obs) {
      return res.status(500).send('Could not find observation');
    }
    Patient.findByIdAndUpdate(obs.patient_ID,
      { $pullAll: { observation_periods: [obs.id] } },
      {},
      (patientErr) => {
        if (patientErr) {
          return res.status(500).send(patientErr);
        }
        obs.remove((delErr) => {
          if (delErr) {
            return res.status(500).send(delErr);
          }
          return res.status(200).send('Observation deleted successfully');
        });
      });
  });
};
