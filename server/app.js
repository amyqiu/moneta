var express = require('express');
var bodyParser = require('body-parser');

// Import routes for the patients and entries
var routes = require('./routes/routes');
var app = express();
app.use('', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://user1:QUO3LpoGzjcRhrTY@moneta-xbrhg.mongodb.net/test?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
