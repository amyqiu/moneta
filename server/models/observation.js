var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Entry = require('../models/entry');

// Define ObservationSchema
var ObservationSchema = new Schema({
    patient_ID: {type: String, required: true, max: 100},
    start_time: {type: Date, required: true},
    end_time: {type: Date, required: true},
    entries: [Entry]
    
});

module.exports = mongoose.model('Observation', ObservationSchema);
