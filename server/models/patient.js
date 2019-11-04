var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Observation = require('../models/observation');

// Define PatientSchema
var PatientSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true},
    room: {type: String, required: true},
    profile_picture: {type: String, required: true},
    observation_periods: [Observation],
    in_observation: {type: Boolean, required: true}

});

module.exports = mongoose.model('Patient', PatientSchema);
