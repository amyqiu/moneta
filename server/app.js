var express = require('express');
var bodyParser = require('body-parser');

// Import routes
var routes = require('./routes/routes');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('', routes);

// Set up mongoose connection
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var mongoURI;
if (process.env.MONGODB_URI) {
  mongoURI = process.env.MONGODB_URI
} else {
  var dbConfig = require('./config');
  mongoURI = dbConfig.url;
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true
})
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});
