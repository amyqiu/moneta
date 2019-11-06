const Entry = require('../models/entry');
const Observation = require('../models/observation');

// Test url
exports.entry_test = function (req, res) {
  return res.status(200).send('Greetings from the entry test controller!');
};

function updateAggregatedData(req, res, obs, entry) {
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
}

exports.entry_create = function (req, res) {
  const entry = new Entry(
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

  Observation.findById(req.body.observation_ID, function (obsErr, obs) {
    if (obsErr) {
      return res.status(500).send(obsErr);
    } else if (obs.patient_ID !== req.body.patient_ID) {
      return res.status(500).send("Invalid patient ID for the observation ID.");
    } else if (obs.end_time != null) {
      return res.status(500).send("Observation period has ended.");
    }

    updateAggregatedData(req, res, obs, entry);

    const obsUpdate = {
      entries: obs.entries,
      aggregated_behaviours: obs.aggregated_behaviours,
      aggregated_contexts: obs.aggregated_contexts,
      aggregated_locations: obs.aggregated_locations,
      entry_times: obs.entry_times,
    };
    Observation.findByIdAndUpdate(req.body.observation_ID, {$set: obsUpdate}, function (updateErr, updatedObs) {
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

// TODO: find all entries based on patient ID + observation period ID

exports.entry_find_all = function (req, res) {
  Entry.find(function (err, entries) {
    if (err) {
      return res.send(err);
    }
    return res.send(entries);
  });
}

exports.entry_details = function (req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if (err) return next(err);
    return res.send(entry);
  });
};

exports.entry_update = function (req, res) {
  Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).send('Entry updated');
  });
};

//TODO: delete associate data in aggregated data
exports.entry_delete = function (req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if (err) {
      return res.status(500).send(err);
    } else if (entry == null) {
      return res.status(500).send('No such object');
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
