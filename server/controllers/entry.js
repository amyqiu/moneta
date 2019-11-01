var Entry = require('../models/entry');

// Test url
exports.entry_test = function (req, res) {
    res.send('Greetings from the entry test controller!');
};

exports.entry_create = function (req, res) {
    var entry = new Entry(
        {
            patient_ID: req.body.patient_ID,

            // Behaviours Observed
            sleep_bed: req.body.sleep_bed,
            awake: req.body.awake,
            positively_engaged: req.body.positively_engaged,
            conversing: req.body.conversing,
            hugging: req.body.hugging,
            smiling: req.body.smiling,
            noisy: req.body.noisy,
            crying: req.body.crying,
            grunting: req.body.grunting,
            questions: req.body.questions,
            words: req.body.words,
            restless: req.body.restless,
            fidgeting: req.body.fidgeting,
            exploring: req.body.exploring,
            rattling: req.body.rattling,
            exit_seeking: req.body.exit_seeking,
            agressive_verbal: req.body.agressive_verbal,
            insults: req.body.insults,
            swearing: req.body.swearing,
            screaming: req.body.screaming,
            agressive_physical: req.body.agressive_physical,
            biting: req.body.biting,
            grabbing: req.body.grabbing,
            punching: req.body.punching,
            kicking: req.body.kicking,
            throwing: req.body.throwing,
            self_injurious: req.body.self_injurious,
            agressive_sexual: req.body.agressive_sexual,
            explicit_sexual_comments: req.body.explicit_sexual_comments,
            public_masturbation: req.body.public_masturbation,
            touching_others: req.body.touching_others,

            // Location
            common_area: req.body.common_area,
            individual_room: req.body.individual_room,
            cafeteria: req.body.cafeteria,
            other_location: req.body.other_location,

            // Context
            alone: req.body.alone,
            loud_env: req.body.loud_env,
            quiet_env: req.body.quiet_env,
            visitors_present: req.body.visitors_present,
            personal_care: req.body.personal_care,
            nutrition: req.body.nutrition,
            medication: req.body.medication,
            pain_medication: req.body.pain_medication,
            treatment: req.body.treatment,
            directed_residents: req.body.directed_residents,
            directed_staff: req.body.directed_staff,

            // Comments
            comments: req.body.comments,

            // Time
            time: req.body.time
        }
    );

    entry.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Entry created successfully')
    })
};

exports.entry_find_all = function (req, res) {
    Entry.find(function (err, entries) {
        if (err) return next(err);
        res.send(entries);
    })
}

exports.entry_details = function (req, res) {
    Entry.findById(req.params.id, function (err, entry) {
        if (err) return next(err);
        res.send(entry);
    })
};

exports.entry_update = function (req, res) {
    Entry.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, entry) {
        if (err) return next(err);
        res.send('Entry updated');
    });
};

exports.entry_delete = function (req, res) {
    Entry.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Entry deleted successfully');
    })
};
