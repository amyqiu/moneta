var Entry = require('../models/entry');

// Test url
exports.entry_test = function (req, res) {
    res.send('Greetings from the entry test controller!');
};

exports.entry_create = function (req, res) {
    var entry = new Entry(
        {
            patient_ID: req.body.patient_ID,
            observation_ID: req.body.observation_ID,
            behaviors: req.body.behaviors,
            locations: req.body.locations,
            context: req.body.context,
            comments: req.body.comments,
            time: req.body.time
        }
    );

    entry.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Entry created successfully')
    })
};

// find all entries based on patient ID + observation period ID

exports.entry_find_all = function (req, res) {
    Entry.find(function (err, entries) {
        if (err) return next(err);
        res.send(entries);
    })
}

exports.entry_details = function (req, res) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);
        res.send(entry);
    })
};

exports.entry_update = function (req, res) {
    Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
        if (err) return next(err);
        res.send('Entry updated');
    });
};

exports.entry_delete = function (req, res) {
    Entry.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Entry deleted successfully');
    })
};
