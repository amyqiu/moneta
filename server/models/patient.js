var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define PatientSchema
var PatientSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true},
    room: {type: String, required: true}

});

module.exports = mongoose.model('Patient', PatientSchema);
