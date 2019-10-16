var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
    name: {type: String, required: true, max: 100},
    age: {type: Number, required: true},
    
});

// Export the model
module.exports = mongoose.model('Patient', PatientSchema);
