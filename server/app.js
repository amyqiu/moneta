var express = require('express');
var bodyParser = require('body-parser');

// Imports routes for the patients
var patient = require('./routes/patient');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/patients', patient);

// Set up mongoose connection
var mongoose = require('mongoose');
var dbConfig = require('./config');
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
})
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
