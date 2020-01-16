const { validationResult, body } = require('express-validator/check');
const Observation = require('../models/observation');
const Patient = require('../models/patient');

const STARTING_REASONS = new Set([
  'Baseline/Admission',
  'Transition/Move',
  'New Behaviour',
  'Behaviour Change',
  'New Intervention',
  'Medication Adjustment',
  'Urgent Referral/Transfer',
]);

const NEXT_STEPS = new Set([
  'Repeat DOS in 4-6 weeks',
  'No further DOS',
  'ABC charting for behaviour',
  'Clinical huddle/meeting',
  'Progress note written',
  'Consult with substitute decision maker (SDM)',
  'Medication adjustment/review',
  'Non-pharmacological interventions',
  'Care plan updated',
  'Referral',
]);

exports.validate = (method) => {
  switch (method) {
    case 'observation_create': {
      return [
        body('patient_ID').exists().isString(),
        body('start_time').exists().isInt(),
        body('starting_notes').exists().isString(),
        body('personalized_behaviour_1_title').exists().isString(),
        body('personalized_behaviour_2_title').exists().isString(),
        body('personalized_context_1_title').exists().isString(),
        body('personalized_context_2_title').exists().isString(),
      ];
    }
    case 'observation_end': {
      return [
        body('id').exists().isString(),
        body('patient_ID').exists().isString(),
        body('end_time').exists().isInt(),
        body('ending_notes').exists().isString(),
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
    if (!Array.isArray(req.body.reasons)) {
      return res.status(500).send('Unable to parse reasons for starting observation');
    }

    for (let i = 0; i < req.body.reasons.length; i += 1) {
      if (!STARTING_REASONS.has(req.body.reasons[i])) {
        return res.status(500).send('Invalid reasons for starting observation');
      }
    }

    observation = new Observation(
      {
        patient_ID: req.body.patient_ID,
        start_time: new Date(req.body.start_time * 1000),
        entries: [],
        starting_notes: req.body.starting_notes,
        reasons: req.body.reasons,
        personalized_behaviour_1_title: req.body.personalized_behaviour_1_title,
        personalized_behaviour_2_title: req.body.personalized_behaviour_2_title,
        personalized_context_1_title: req.body.personalized_context_1_title,
        personalized_context_2_title: req.body.personalized_context_2_title,
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

  if (!Array.isArray(req.body.next_steps)) {
    return res.status(500).send('Unable to parse next steps for observation');
  }

  for (let i = 0; i < req.body.next_steps.length; i += 1) {
    if (!NEXT_STEPS.has(req.body.next_steps[i])) {
      return res.status(500).send('Invalid next steps for observation');
    }
  }

  const update = {
    end_time: new Date(req.body.end_time * 1000),
    ending_notes: req.body.ending_notes,
    next_steps: req.body.next_steps,
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

// Find Pearson Correlation Coefficient
function getPearsonCoefficient(x, y) {
  const n = x.length;
  const d = new Array(n);
  for (let i = 0; i < n; i += 1) {
    d[i] = x[i] * y[i];
  }
  const sum = d.reduce((a, b) => a + b, 0);
  return sum / (n - 1);
}

// Return top 3 correlations for each negavtive behaviour in observation period
exports.observation_get_correlations = (req, res) => {
  Observation
    .findById(req.query.id)
    .exec((err, obs) => {
      if (err) {
        return res.status(500).send(err);
      } if (!obs) {
        return res.status(500).send('Could not find observation');
      }
      const correlations = [];
      const negativeBehaviours = ['Noisy', 'Restless', 'Exit Seeking', 'Aggressive - Verbal', 'Aggressive - Physical', 'Aggressive - Sexual'];
      if (obs.personalized_behaviour_1_title) { negativeBehaviours.push('Personalized Behaviour 1'); }
      if (obs.personalized_behaviour_2_title) { negativeBehaviours.push('Personalized Behaviour 2'); }

      for (let i = 0; i < negativeBehaviours.length; i += 1) {
        const bArray = obs.aggregated_behaviours.get(negativeBehaviours[i]);
        const sum = bArray.reduce((a, b) => a + b, 0);
        // Find behaviours that occurred over 5 times, return empty list if none
        if (sum >= 5) {
          const list = [];
          // Check against all locations
          const it = obs.aggregated_locations.keys();
          for (let j = 0; j < obs.aggregated_locations.size; j += 1) {
            const temp = {};
            temp.trigger = it.next().value;
            temp.coeff = getPearsonCoefficient(bArray, obs.aggregated_locations.get(temp.trigger));
            list.push(temp);
          }
          // Check against all contexts
          const it2 = obs.aggregated_contexts.keys();
          for (let k = 0; k < obs.aggregated_contexts.size; k += 1) {
            const temp = {};
            temp.trigger = it2.next().value;
            temp.coeff = getPearsonCoefficient(bArray, obs.aggregated_contexts.get(temp.trigger));
            list.push(temp);
          }
          // Check time of occurrence and return most frequent hour
          const hours = []; const times = []; let timeString = '';
          for (let l = 0; l < obs.entry_times.length; l += 1) {
            if (bArray[l] === 1) {
              let hour = obs.entry_times[l].getHours();
              const min = obs.entry_times[l].getMinutes();
              let roundedMin = Math.round(min / 30) * 30;
              if (roundedMin === 60) {
                roundedMin = 0;
                hour += 1;
              }
              let ampm = 'PM';
              if (hour >= 0 && hour < 12) {
                if (hour === 0) {
                  hour = 12;
                }
                ampm = 'AM';
              } else if (hour > 12) {
                hour -= 12;
              }
              if (roundedMin === 0) {
                timeString = `${hour}:${roundedMin}0${ampm}`;
              } else {
                timeString = `${hour}:${roundedMin}${ampm}`;
              }
              if (hours.includes(timeString)) {
                for (let m = 0; m < times.length; m += 1) {
                  if (timeString === times[m].value) {
                    times[m].frequency += 1;
                  }
                }
              } else {
                const temp = {};
                temp.value = timeString;
                temp.frequency = 1;
                times.push(temp);
              }
              hours.push(timeString);
            }
          }
          // Sort and find top 3 triggers and top 3 times
          list.sort((a, b) => b.coeff - a.coeff);
          times.sort((a, b) => b.frequency - a.frequency);
          const b = {};
          b.behaviour = negativeBehaviours[i];
          b.results = list.slice(0, 3);
          if (times.length >= 3) {
            b.times = times.slice(0, 3);
          } else {
            b.times = times;
          }
          correlations.push(b);
        }
      }
      return res.status(200).send(correlations);
    });
};
