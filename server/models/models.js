var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define PatientSchema
var PatientSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true},

});

// Define EntrySchema
var EntrySchema = new Schema({
    // Requires patient_ID to associate entries with patient
    patient_ID: {type: String, required: true, max: 100},

    // Behaviours Observed
    sleep_bed: {type: Boolean, default: false},
    awake: {type: Boolean, default: false},
    positively_engaged: {type: Boolean, default: false},
    noisy: {type: Boolean, default: false},
    restless: {type: Boolean, default: false},
    exit_seeking: {type: Boolean, default: false},
    agressive_verbal: {type: Boolean, default: false},
    agressive_physical: {type: Boolean, default: false},
    agressive_sexual: {type: Boolean, default: false},

    // Location
    common_area: {type: Boolean, default: false},
    individual_room: {type: Boolean, default: false},
    cafeteria: {type: Boolean, default: false},
    other_location: {type: String, default: ""},

    // Context
    alone: {type: Boolean, default: false},
    loud_env: {type: Boolean, default: false},
    quiet_env: {type: Boolean, default: false},
    visitors_present: {type: Boolean, default: false},
    personal_care: {type: Boolean, default: false},
    nutrition: {type: Boolean, default: false},
    medication: {type: Boolean, default: false},
    pain_medication: {type: Boolean, default: false},
    treatment: {type: Boolean, default: false},
    directed_residents: {type: Boolean, default: false},
    directed_staff: {type: Boolean, default: false},

    // Comments
    comments: {type: String, default: ""}

}, {
    timestamps: true
});

// Export all models
var patient_model = mongoose.model('Patient', PatientSchema);
var entry_model = mongoose.model('Entry', EntrySchema);

module.exports = {
    Patient: patient_model,
    Entry: entry_model
};
