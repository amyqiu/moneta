const Patient = require('../models/patient');
const Observation = require('../models/observation')
const { validationResult, body } = require('express-validator/check');

//TODO: Add endpoints for getting entries for a day + days with entries

exports.validate = (method) => {
  switch (method) {
    case 'patient_create': {
     return [
        body('name').exists().isString(),
        body('age').exists().isInt(),
        body('room').exists().isString(),
        body('profile_picture').exists().isString(),
        body('display_ID').exists().isString(),
       ]
    }
  }
}

// Test url
exports.patient_test = function (req, res) {
  return res.status(200).send('Greetings from the patient test controller!');
};

exports.patient_create = function (req, res) {
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
      }
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

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
      } else if (!patient) {
        return res.status(500).send("Patient does not exist");
      }
      return res.status(200).send(patient);
    });
};

exports.patient_update = function (req, res) {
  Patient.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, patient) {
    if (err) {
      return res.status(500).send(err);
    } else if (!patient) {
      return res.status(500).send("Patient does not exist");
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

// Get days with entries from an observation period
function get_days_from_period (id, month) {
  return new Promise ((resolve, reject) => {
    Observation.
      findById(id).
      exec(function (err, obs) {
        var days = [];
        // TODO: check if there are no entries in observation period
        for (time of obs.entry_times) {
          if (time.getMonth() + 1 == month){
            days.push(time.getDate())
          }
        }
        setTimeout(() => resolve(days), 300)
  })
});
}

// Get days with entries given month
exports.get_days_with_entries = function (req, res) {
  if(isNaN(req.params.month)){
    return res.status(500).send("Month is not a number");
  }
  Patient.
    findById(req.params.id).
    populate('observation_periods', 'start_time end_time').
    exec(async function (err, patient) {
      if (err) {
        return res.status(500).send(err);
      } else if (!patient) {
        return res.status(500).send("Patient does not exist");
      } else if (patient.observation_periods.length < 1){
        return res.status(500).send("Patient has no observations");
      }
      // Loop through each observation period, check if start_time is in same month
      var date_array = [];
      for (period of patient.observation_periods) {
        if (period.start_time.getMonth() + 1 == req.params.month) {
          try {
            var days = await get_days_from_period(period.id, req.params.month);
            date_array.push(days)
          } catch (err) {
            return res.status(500).send("Error getting entry days from observation");
          }
        }
      };
      // Convert to 1D array and remove duplicates
      var date_1d = [];
      for(var i = 0; i < date_array.length; i++) {
          date_1d = date_1d.concat(date_array[i]);
      }
      var unique_dates = date_1d.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
      return res.status(200).send(unique_dates);
    });
};
