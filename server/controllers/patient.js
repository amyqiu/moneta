var Patient = require('../models/patient');

// Test url
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.patient_create = function (req, res) {
    var patient = new Patient(
        {
            name: req.body.name,
            age: req.body.age
        }
    );

    patient.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Patient created successfully')
    })
};

exports.patient_details = function (req, res) {
    Patient.findById(req.params.id, function (err, patient) {
        if (err) return next(err);
        res.send(patient);
    })
};

exports.patient_update = function (req, res) {
    Patient.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, patient) {
        if (err) return next(err);
        res.send('Patient updated');
    });
};

exports.patient_delete = function (req, res) {
    Patient.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Patient deleted successfully');
    })
};
