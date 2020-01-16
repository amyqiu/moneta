const { validationResult, body } = require('express-validator/check');
const Patient = require('../models/patient');
const Entry = require('../models/entry');

exports.validate = (method) => {
  switch (method) {
    case 'patient_create': {
      return [
        body('name').exists().isString(),
        body('age').exists().isInt(),
        body('room').exists().isString(),
        body('profile_picture').exists().isString(),
        body('display_ID').exists().isString(),
      ];
    } default: {
      return [];
    }
  }
};

// Test url
exports.patient_test = (req, res) => res.status(200).send('Greetings from the patient test controller!');

exports.patient_create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let patient;
  try {
    patient = new Patient(
      {
        name: req.body.name,
        age: req.body.age,
        room: req.body.room,
        profile_picture: req.body.profile_picture,
        observation_periods: [],
        in_observation: false,
        display_ID: req.body.display_ID,
      },
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

  patient.save((err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Patient created successfully');
  });
};

exports.patient_find_all = (req, res) => {
  Patient
    .find()
    .populate('observation_periods', 'start_time end_time')
    .exec((err, patients) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send(patients);
    });
};

exports.patient_details = (req, res) => {
  Patient
    .findById(req.params.id)
    .populate('observation_periods', 'start_time end_time')
    .exec((err, patient) => {
      if (err) {
        return res.status(500).send(err);
      } if (!patient) {
        return res.status(500).send('Patient does not exist');
      }
      return res.status(200).send(patient);
    });
};

exports.patient_update = (req, res) => {
  Patient.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, patient) => {
    if (err) {
      return res.status(500).send(err);
    } if (!patient) {
      return res.status(500).send('Patient does not exist');
    }
    return res.status(200).send('Patient updated');
  });
};

exports.patient_delete = (req, res) => {
  Patient.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Patient deleted successfully');
  });
};

exports.find_days_with_entries = (req, res) => {
  if (Number.isNaN(req.query.month)
    || Number.isNaN(req.query.year)) {
    return res.status(500).send('Month/Day is not a number');
  }
  Patient
    .findById(req.query.id)
    .populate('observation_periods', 'start_time end_time')
    .exec(async (err, patient) => {
      if (err) {
        return res.status(500).send(err);
      } if (!patient) {
        return res.status(500).send('Patient does not exist');
      } if (patient.observation_periods.length < 1) {
        return res.status(500).send('Patient has no observations');
      }
      const month = parseInt(req.query.month, 10);
      const year = parseInt(req.query.year, 10);
      const obsIDs = new Set();
      for (let i = 0; i < patient.observation_periods.length; i += 1) {
        const period = patient.observation_periods[i];
        if (period.start_time.getMonth() + 1 === month
          && period.start_time.getFullYear() === year) {
          try {
            obsIDs.add(period.id);
          } catch (obsErr) {
            return res.status(500).send('Error getting observation IDs');
          }
        } else if (period.start_time.getMonth() + 1 > month
        || period.start_time.getFullYear() > year) {
          break;
        }
      }
      const uniqueIDs = Array.from(obsIDs);

      Entry.find({ observation_ID: { $in: uniqueIDs } })
        .exec((obvErr, entries) => {
          const entryDays = new Set();
          if (obvErr) {
            return res.status(500).send(err);
          } if (!entries) {
            return res.status(500).send('Entries do not exist');
          }
          for (let j = 0; j < entries.length; j += 1) {
            const entry = entries[j];
            if (entry.time.getMonth() + 1 === month
              && entry.time.getFullYear() === year) {
              try {
                entryDays.add(entry.time.getDate());
              } catch (dayErr) {
                return res.status(500).send('Error getting entry days from observation');
              }
            }
          }
          const entryDayArray = Array.from(entryDays);
          return res.status(200).send(entryDayArray);
        });
    });
};

// Get most recent entry time for a patient in an observation period
exports.last_entry_time = (req, res) => {
  Patient
    .findById(req.query.id)
    .populate('observation_periods', 'entry_times start_time')
    .exec(async (err, patient) => {
      if (err) {
        return res.status(500).send(err);
      } if (!patient) {
        return res.status(500).send('Patient does not exist');
      } if (!patient.in_observation || patient.observation_periods.length === 0) {
        return res.status(500).send('Patient is not in observation');
      }

      const numObservations = patient.observation_periods.length;
      const lastObservationPeriod = patient.observation_periods[numObservations - 1];
      const numEntries = lastObservationPeriod.entry_times.length;

      if (numEntries === 0) {
        return res.status(200).send(lastObservationPeriod.start_time);
      }
      return res.status(200).send(lastObservationPeriod.entry_times[numEntries - 1]);
    });
};
