var Models = require('../models/models');

// Test url
exports.patient_test = function (req, res) {
    res.send('Greetings from the patient test controller!');
};

exports.patient_create = function (req, res) {
    var patient = new Models.Patient(
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

exports.patient_find_all = function (req, res) {
    Models.Patient.find(function (err, patients) {
        if (err) return next(err);
        res.send(patients);
    })
}

exports.patient_details = function (req, res) {
    Models.Patient.findById(req.params.id, function (err, patient) {
        if (err) return next(err);
        res.send(patient);
    })
};

exports.patient_update = function (req, res) {
    Models.Patient.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, patient) {
        if (err) return next(err);
        res.send('Patient updated');
    });
};

exports.patient_delete = function (req, res) {
    Models.Patient.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Patient deleted successfully');
    })
};
