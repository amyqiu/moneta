const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define ObservationSchema
const ObservationSchema = new Schema({
  patient_ID: {type: String, required: true, max: 100},
  start_time: {type: Date, required: true},
  end_time: {type: Date, required: false},
  entries: [{type: mongoose.Schema.Types.ObjectId, ref: 'Entry'}]
});

module.exports = mongoose.model('Observation', ObservationSchema);
