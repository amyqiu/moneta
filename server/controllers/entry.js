const Entry = require('../models/entry');
const Observation = require('../models/observation');

// Test url
exports.entry_test = function (req, res) {
  res.send('Greetings from the entry test controller!');
};

exports.entry_create = function (req, res) {
  const entry = new Entry(
    {
      patient_ID: req.body.patient_ID,
      observation_ID: req.body.observation_ID,
      behaviours: req.body.behaviours,
      locations: req.body.locations,
      context: req.body.context,
      comments: req.body.comments,
      time: req.body.time
    }
  );

  entry.save(function (err) {
    if (err) {
      res.send(err);
    }
    Observation.findById(req.body.observation_ID, function (obsErr, obs) {
      if (obsErr) {
        res.send(obsErr);
      } else if (obs.patient_ID !== req.body.patient_ID) {
        res.send("Invalid patient ID for the observation ID.");
      } else if (obs.end_time != null) {
        res.send("Observation period has ended.");
      }
      obs.entries.push(entry.id);
      const obsUpdate = {
        entries: obs.entries,
      };
      Observation.findByIdAndUpdate(req.body.observation_ID, {$set: obsUpdate}, function (updateErr, updatedObs) {
        if (updateErr) {
          res.send(updateErr);
        }
        res.send('Entry created successfully');
      });
    });
  });
};

// find all entries based on patient ID + observation period ID

exports.entry_find_all = function (req, res) {
  Entry.find(function (err, entries) {
    if (err) {
      res.send(err);
    }
    res.send(entries);
  });
}

exports.entry_details = function (req, res) {
  Entry.findById(req.params.id, function (err, entry) {
    if (err) return next(err);
    res.send(entry);
  });
};

exports.entry_update = function (req, res) {
  Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
    if (err) {
      res.send(err);
    }
    res.send('Entry updated');
  });
};

exports.entry_delete = function (req, res) {
  Entry.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Entry deleted successfully');
  });
};
