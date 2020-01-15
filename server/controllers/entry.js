const { validationResult, body } = require('express-validator/check');
const Entry = require('../models/entry');
const Observation = require('../models/observation');
const Patient = require('../models/patient');

exports.validate = (method) => {
  switch (method) {
    case 'entry_create': {
      return [
        body('patient_ID').exists().isString(),
        body('observation_ID').exists().isString(),
        body('behaviours').optional(),
        body('locations').optional(),
        body('contexts').optional(),
        body('comments').optional().isString(),
        body('time').exists().isInt(),
      ];
    }
    default: {
      return [];
    }
  }
};

// Test url
exports.entry_test = (req, res) => res.status(200).send('Greetings from the entry test controller!');

function updateAggregatedData(req, res, obs, entry) {
  try {
    // Populate aggregated behaviour data
    for (let i = 0; i < Object.keys(req.body.behaviours).length; i += 1) {
      const behaviour = Object.keys(req.body.behaviours)[i];
      if (!obs.aggregated_behaviours.has(behaviour)) {
        return res.status(500).send(`Invalid behaviour specified: ${behaviour}`);
      }
      obs.aggregated_behaviours.get(behaviour).push(1);
      for (let j = 0; j < req.body.behaviours[behaviour].length; j += 1) {
        const subbehaviour = req.body.behaviours[behaviour][j];
        if (!obs.aggregated_behaviours.has(subbehaviour)) {
          return res.status(500).send('Invalid sub-behaviour specified');
        }
        obs.aggregated_behaviours.get(subbehaviour).push(1);
      }
    }

    // Populate aggregated contexts data
    for (let i = 0; i < req.body.contexts.length; i += 1) {
      const context = req.body.contexts[i];
      if (!obs.aggregated_contexts.has(context)) {
        return res.status(500).send('Invalid context specified');
      }
      obs.aggregated_contexts.get(context).push(1);
    }

    // Populate aggregated locations data
    for (let i = 0; i < req.body.locations.length; i += 1) {
      const location = req.body.locations[i];
      if (!obs.aggregated_locations.has(location)) {
        return res.status(500).send('Invalid location specified');
      }
      obs.aggregated_locations.get(location).push(1);
    }

    obs.entries.push(entry.id);
    obs.entry_times.push(new Date(req.body.time * 1000));

    // Add zeroes for all unchecked options
    obs.aggregated_behaviours.forEach((a) => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
    obs.aggregated_locations.forEach((a) => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
    obs.aggregated_contexts.forEach((a) => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
  } catch (e) {
    return res.status(500).send('An error occurred while aggregating data');
  }
}

exports.entry_create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let entry;
  try {
    entry = new Entry(
      {
        patient_ID: req.body.patient_ID,
        observation_ID: req.body.observation_ID,
        behaviours: req.body.behaviours,
        locations: req.body.locations,
        contexts: req.body.contexts,
        comments: req.body.comments,
        time: new Date(req.body.time * 1000),
      },
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

  Observation.findById(req.body.observation_ID, (obsErr, obs) => {
    if (obsErr) {
      return res.status(500).send(obsErr);
    } if (!obs) {
      return res.status(500).send('Observation does not exist');
    } if (obs.patient_ID !== req.body.patient_ID) {
      return res.status(500).send('Invalid patient ID for the observation ID');
    } if (obs.end_time != null) {
      return res.status(500).send('Observation period has ended');
    }

    updateAggregatedData(req, res, obs, entry);

    const obsUpdate = {
      entries: obs.entries,
      aggregated_behaviours: obs.aggregated_behaviours,
      aggregated_contexts: obs.aggregated_contexts,
      aggregated_locations: obs.aggregated_locations,
      entry_times: obs.entry_times,
    };
    Observation.findByIdAndUpdate(req.body.observation_ID, { $set: obsUpdate }, (updateErr) => {
      if (updateErr) {
        return res.status(500).send(updateErr);
      }
      entry.save((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send('Entry created successfully');
      });
    });
  });
};

exports.entry_find_all = (req, res) => {
  Entry.find((err, entries) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send(entries);
  });
};

exports.entry_find_day = (req, res) => {
  if (Number.isNaN(req.query.month)
    || Number.isNaN(req.query.day)
    || Number.isNaN(req.query.year)) {
    return res.status(500).send('Month/Day/Year is not a number');
  }
  // use ID of patient to find all of the entries associated with that patient for specific day

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
      const dateArray = new Set();
      for (let i = 0; i < patient.observation_periods.length; i += 1) {
        const period = patient.observation_periods[i];
        if (period.start_time.getMonth() + 1 === month
          && period.start_time.getFullYear() === year) {
          try {
            dateArray.add(period.id);
          } catch (daysErr) {
            return res.status(500).send('Error getting entry days from observation');
          }
        } else if (period.start_time.getMonth() + 1 > month
        || period.start_time.getFullYear() > year) {
          break;
        }
      }
      // make the dateArray a set, it will remove duplicates already
      const uniqueDates = Array.from(dateArray);

      const day = parseInt(req.query.day, 10);

      Entry.find({ observation_ID: { $in: uniqueDates } })
        .exec((obvErr, entries) => {
          const entryDayArray = [];
          if (obvErr) {
            return res.status(500).send(err);
          } if (!entries) {
            return res.status(500).send('Entries do not exist');
          }
          for (let j = 0; j < entries.length; j += 1) {
            const entry = entries[j];
            if (entry.time.getMonth() + 1 === month
              && entry.time.getDate() === day
              && entry.time.getFullYear() === year) {
              try {
                // console.log(entry);
                entryDayArray.push(entry);
              } catch (dayErr) {
                return res.status(500).send('Error getting entry days from observation');
              }
            }
          }
          return res.status(200).send(entryDayArray);
        });
    });
};

exports.entry_details = (req, res) => {
  Entry.findById(req.params.id, (err, entry) => {
    if (err) {
      return res.status(500).send(err);
    } if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    return res.status(200).send(entry);
  });
};

exports.entry_update = (req, res) => {
  Entry.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, entry) => {
    if (err) {
      return res.status(500).send(err);
    } if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    return res.status(200).send('Entry updated');
  });
};

// TODO: delete associated data in aggregated data?
exports.entry_delete = (req, res) => {
  Entry.findById(req.params.id, (err, entry) => {
    if (err) {
      return res.status(500).send(err);
    } if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    Observation.findByIdAndUpdate(
      entry.observation_ID,
      { $pullAll: { entries: [entry.id] } },
      (obsErr) => {
        if (obsErr) {
          return res.status(500).send(obsErr);
        }
        entry.remove((delErr) => {
          if (delErr) {
            return res.status(500).send(delErr);
          }
          return res.status(200).send('Entry deleted successfully');
        });
      },
    );
  });
};
