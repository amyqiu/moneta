const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define EntrySchema
const EntrySchema = new Schema({
  patient_ID: { type: String, required: true, max: 100 },
  observation_ID: { type: String, required: true, max: 100 },
  behaviours: { type: Map, of: [String], required: true },
  locations: { type: [String], required: true },
  contexts: { type: [String], required: true },
  comments: { type: String, default: '' },
  time: { type: Date, required: true },
});

module.exports = mongoose.model('Entry', EntrySchema);
