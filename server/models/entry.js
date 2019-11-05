var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define EntrySchema
var EntrySchema = new Schema({
  patient_ID: {type: String, required: true, max: 100},
  observation_ID: {type: String, required: true, max: 100},
  behaviors: {type: Map, of: [String]},
  locations: [String],
  context: [String],
  comments: {type: String, default: ""},
  time: {type: Date, required: true}
});

module.exports = mongoose.model('Entry', EntrySchema);
