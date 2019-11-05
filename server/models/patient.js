var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define PatientSchema
var PatientSchema = new Schema({
  name: {type: String, required: true, max: 100},
  age: {type: Number, required: true},
  room: {type: String, required: true},
  profile_picture: {type: String, required: true},
  observation_periods: [mongoose.Schema.Types.ObjectId],
  in_observation: {type: Boolean, required: true},
  patient_ID: {type: String, required: true, max: 100},
});

module.exports = mongoose.model('Patient', PatientSchema);
