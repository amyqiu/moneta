const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define PatientSchema
const PatientSchema = new Schema({
  name: {type: String, required: true, max: 100},
  age: {type: Number, required: true},
  room: {type: String, required: true},
  profile_picture: {type: String, required: true},
  observation_periods: [{type: mongoose.Schema.Types.ObjectId, ref: 'Observation'}],
  in_observation: {type: Boolean, required: true},
  patient_ID: {type: String, required: true, max: 100},
});

module.exports = mongoose.model('Patient', PatientSchema);
