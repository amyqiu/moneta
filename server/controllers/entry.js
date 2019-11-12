const Entry = require('../models/entry');
const Observation = require('../models/observation');
const Patient = require('../models/patient');
const { validationResult, body } = require('express-validator/check');

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
      ]
    }
  }
}

// Test url
exports.entry_test = function (req, res) {
  return res.status(200).send('Greetings from the entry test controller!');
};

function updateAggregatedData(req, res, obs, entry) {
  try {
    // Populate aggregated behaviour data
    for (behaviour of Object.keys(req.body.behaviours)) {
      if (!obs.aggregated_behaviours.has(behaviour)){
        return res.status(500).send("Invalid behaviour specified: " + behaviour);
      }
      obs.aggregated_behaviours.get(behaviour).push(1);
      for (subbehaviour of req.body.behaviours[behaviour]) {
        if (!obs.aggregated_behaviours.has(subbehaviour)){
          return res.status(500).send("Invalid sub-behaviour specified");
        }
        obs.aggregated_behaviours.get(subbehaviour).push(1);
      }
    }

    // Populate aggregated contexts data
    for (context of req.body.contexts) {
      if (!obs.aggregated_contexts.has(context)){
        return res.status(500).send("Invalid context specified");
      }
      obs.aggregated_contexts.get(context).push(1);
    }

    // Populate aggregated locations data
    for (location of req.body.locations) {
      if (!obs.aggregated_locations.has(location)){
        return res.status(500).send("Invalid location specified");
      }
      obs.aggregated_locations.get(location).push(1);
    }

    obs.entries.push(entry.id);
    obs.entry_times.push(new Date(req.body.time * 1000));

    // Add zeroes for all unchecked options
    obs.aggregated_behaviours.forEach(a => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
    obs.aggregated_locations.forEach(a => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
    obs.aggregated_contexts.forEach(a => {
      if (a.length < obs.entry_times.length) {
        a.push(0);
      }
    });
  } catch (e) {
    return res.status(500).send("An error occurred while aggregating data");
  }
}

exports.entry_create = function (req, res) {
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
      }
    );
  } catch (createErr) {
    return res.status(500).send(createErr);
  }

  Observation.findById(req.body.observation_ID, function (obsErr, obs) {
    if (obsErr) {
      return res.status(500).send(obsErr);
    } else if (!obs) {
      return res.status(500).send("Observation does not exist");
    } else if (obs.patient_ID !== req.body.patient_ID) {
      return res.status(500).send("Invalid patient ID for the observation ID");
    } else if (obs.end_time != null) {
      return res.status(500).send("Observation period has ended");
    }

    updateAggregatedData(req, res, obs, entry);

    const obsUpdate = {
      entries: obs.entries,
      aggregated_behaviours: obs.aggregated_behaviours,
      aggregated_contexts: obs.aggregated_contexts,
      aggregated_locations: obs.aggregated_locations,
      entry_times: obs.entry_times,
    };
    Observation.findByIdAndUpdate(req.body.observation_ID, {$set: obsUpdate}, function (updateErr) {
      if (updateErr) {
        return res.status(500).send(updateErr);
      }
      entry.save(function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send('Entry created successfully');
      });
    });
  });
};

// TODO: find all entries based on the time period
// We know the

exports.entry_find_all = function (req, res) {
  Entry.find(function (err, entries) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.status(200).send(entries);
  });
}

exports.entry_find_day = function (req, res) {
  if(isNaN(req.body.month) || isNaN(req.body.day) || isNaN(req.body.year)){
  return res.status(500).send("Month/Day/Year is not a number");
  }
  console.log("here");
  // use ID of patient to find all of the entries associated with that patient
  Entry.find({patient_ID: req.body.patient_ID}).
  exec(function(err,entries){
    if (err) {
      return res.status(500).send(err);
    } else if (!entries) {
      return res.status(500).send("Entries does not exist");
    }
    // loop through all of the elements to see if they end up being the thing.
    console.log(entries);
    entry_day_array = [];
    for(entry of entries){
      console.log(entry.time);
      if (entry.time.getMonth() + 1 == req.body.month && entry.time.getDate() == req.body.day && entry.time.getFullYear() == req.body.year){
        try{
        entry_day_array.push(entry)
      } catch(err){
        return res.status(500).send("Error getting entry days from observation");
      }
      }
    };
    return res.status(200).send(entry_day_array);
  });

}

exports.entry_details = function (req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if (err) {
      return res.status(500).send(err);
    } else if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    return res.status(200).send(entry);
  });
};

exports.entry_update = function (req, res) {
  Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
    if (err) {
      return res.status(500).send(err);
    } else if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    return res.status(200).send('Entry updated');
  });
};

//TODO: delete associated data in aggregated data?
exports.entry_delete = function (req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if (err) {
      return res.status(500).send(err);
    } else if (!entry) {
      return res.status(500).send('Entry does not exist');
    }
    Observation.findByIdAndUpdate(entry.observation_ID, { $pullAll: { entries: [entry.id] } }, function (obsErr){
      if (obsErr) {
        return res.status(500).send(obsErr);
      }
      entry.remove(function (delErr) {
        if (delErr) {
          return res.status(500).send(delErr);
        }
        return res.status(200).send('Entry deleted successfully');
      });
    });
  });
};
