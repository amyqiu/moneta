const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const routes = require('./routes/routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('', routes);

// Set up mongoose connection
mongoose.set('useFindAndModify', false);

let mongoURI;
if (process.env.MONGODB_URI) {
  mongoURI = process.env.MONGODB_URI;
} else {
  const dbConfig = require('./config');
  mongoURI = dbConfig.url;
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`Server is up and running on port number ${port}`);
});
