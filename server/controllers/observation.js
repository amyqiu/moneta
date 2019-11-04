var Observation = require('../models/observation');

// Change to create empty list of entries
exports.observation_create = function (req, res) {
    console.log(req.body)
    var observation = new Observation(
        {
          patient_ID: req.body.patient_ID,
          start_time: req.body.start_time,
          end_time: req.body.end_time,
          entries: req.body.entries
        }
    );

    observation.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Observation created successfully')
    })
};

exports.observation_find_all = function (req, res) {
    Observation.find(function (err, observations) {
        if (err) return next(err);
        res.send(observations);
    })
}
