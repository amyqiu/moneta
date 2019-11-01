var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define EntrySchema
var EntrySchema = new Schema({
    // Requires patient_ID to associate entries with patient
    patient_ID: {type: String, required: true, max: 100},

    // Behaviours Observed
    sleep_bed: {type: Boolean, default: false},
    awake: {type: Boolean, default: false},
    positively_engaged: {type: Boolean, default: false},
    conversing: {type: Boolean, default: false},
    hugging: {type: Boolean, default: false},
    smiling: {type: Boolean, default: false},
    noisy: {type: Boolean, default: false},
    crying: {type: Boolean, default: false},
    grunting: {type: Boolean, default: false},
    questions: {type: Boolean, default: false},
    words: {type: Boolean, default: false},
    restless: {type: Boolean, default: false},
    fidgeting: {type: Boolean, default: false},
    exploring: {type: Boolean, default: false},
    rattling: {type: Boolean, default: false},
    exit_seeking: {type: Boolean, default: false},
    agressive_verbal: {type: Boolean, default: false},
    insults: {type: Boolean, default: false},
    swearing: {type: Boolean, default: false},
    screaming: {type: Boolean, default: false},
    agressive_physical: {type: Boolean, default: false},
    biting: {type: Boolean, default: false},
    grabbing: {type: Boolean, default: false},
    punching: {type: Boolean, default: false},
    kicking: {type: Boolean, default: false},
    throwing: {type: Boolean, default: false},
    self_injurious: {type: Boolean, default: false},
    agressive_sexual: {type: Boolean, default: false},
    explicit_sexual_comments: {type: Boolean, default: false},
    public_masturbation: {type: Boolean, default: false},
    touching_others: {type: Boolean, default: false},

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
    comments: {type: String, default: ""},

    // time
    time: {type: Date, required: true}

}, {
    timestamps: true
});

module.exports = mongoose.model('Entry', EntrySchema);
