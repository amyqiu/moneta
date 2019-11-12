const { validationResult, body } = require('express-validator/check');
const Patient = require('../models/patient');
const Observation = require('../models/observation');

// TODO: Add endpoints for getting entries for a day + days with entries

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

// Get days with entries from an observation period
function getDaysFromPeriod(id, month, year) {
  return new Promise((resolve) => {
    Observation
      .findById(id)
      .exec((err, obs) => {
        const days = [];
        if (obs.entry_times.length >= 1) {
          for (let i = 0; i < obs.entry_times.length; i += 1) {
            const time = obs.entry_times[i];
            if (time.getMonth() + 1 === month && time.getFullYear() === year) {
              days.push(time.getDate());
            }
          }
        }
        setTimeout(() => resolve(days), 300);
      });
  });
}

// Get days with entries given month
exports.find_days_with_entries = (req, res) => {
  if (Number.isNaN(req.query.month) || Number.isNaN(req.query.year)) {
    return res.status(500).send('Month/Year is not a number');
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
      // Loop through each observation period, check if start_time is in same month
      const dateArray = [];
      for (let i = 0; i < patient.observation_periods.length; i += 1) {
        const period = patient.observation_periods[i];
        if (period.start_time.getMonth() + 1 === month
          && period.start_time.getFullYear() === year) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const days = await getDaysFromPeriod(period.id, month, year);
            dateArray.push(days);
          } catch (daysErr) {
            return res.status(500).send('Error getting entry days from observation');
          }
        }
      }
      // Convert to 1D array and remove duplicates
      let date1D = [];
      for (let i = 0; i < dateArray.length; i += 1) {
        date1D = date1D.concat(dateArray[i]);
      }
      const uniqueDates = date1D.filter((elem, index, self) => index === self.indexOf(elem));
      return res.status(200).send(uniqueDates);
    });
};
