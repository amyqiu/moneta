# moneta

## Setup Instructions for Server
Run `npm install`

* To run server: `node app.js`
* To test connection: http://localhost:1234/patient/test

Database hosted at: https://cloud.mongodb.com

* Username and Password are same as shared FYFP account
* If a 'MongoNetworkError' is encountered, go to Network Access and click `+ ADD IP ADDRESS` to IP Whitelist

Server deployed to: https://vast-savannah-47684.herokuapp.com/

* Install heroku at https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
* To deploy, run `git subtree push --prefix server heroku master` from the root directory


## Setup Instructions for Client
See https://facebook.github.io/react-native/docs/getting-started

### For Atom
 * Install `linter` and `linter-eslint` packages, with automatic save enabled for `linter-eslint`
 * Also install `flow-ide` for automatic type checking

### Components
 * Using React Native Elements library: https://react-native-elements.github.io/react-native-elements/

### Notes
  * May need to run `sudo npm install -g expo-cli`
  * If on public wifi, use `expo start --tunnel`
  * Expo is on React version 59.0: https://facebook.github.io/react-native/docs/0.59/getting-started
