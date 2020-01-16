/*Explanation of all packages:
{
https://docs.npmjs.com/files/package.json
  "name": "node_passport_login",
  "version": "1.0.0",
  "description": "",
  "main": "app.js", The main field is a module ID that is the primary entry point to your program. That is, if your package is named foo, and a user installs it, and then does require("foo"), then your main module’s exports object will be returned.
  "scripts": {
    "start": "node app.js",  https://docs.npmjs.com/cli/start.html
    "dev": "nodemon app.js" ran by "npm "
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",                Using bcrypt is a secured way to store passwords in my database
    "connect-flash": "^0.1.1",
    "ejs": "^2.7.2",                     Embedded JavaScript templates
    "express": "^4.17.1",                web framework for node
    "express-ejs-layouts": "^2.5.0",     Layout support for ejs in express
    "express-session": "^1.17.0",        
    When a user first logs in or registers for your site, you know who they are because they just submitted their 
    information to your server. You can use that information to create a new record in your database or retrieve an existing one. 
    But how do you keep them authenticated when they do something crazy like reload the page? Magic, that’s how! Also known as sessions.
    
    "mongoose": "^5.7.11", https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
    "passport": "^0.4.0", Passport is authentication middleware for Node.js.
    "passport-local": "^1.0.0" Local username and password authentication strategy for Passport.
  },
  "devDependencies": {
    "nodemon": "^1.19.4" Nodemon is a utility that will monitor for any changes in your source and automatically restart your server.
  }
}


*/

//A callback is a function that is to be executed after another function has finished executing — hence the name ‘call back’.

// The first two lines require() the express module (in node, this is done through creating a variable and equating to require()) 
// and create an Express application object called "app".
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express(); 

//Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI; //the URI of the database provided in the keys file

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...')) //.then(): Attaches callbacks (as specified in the bracket after .then) for the resolution and/or rejection of the Promise.
.catch(err => console.log(err)); //Same as above, except attaches a callback for only the rejection of the Promise. 

//EJS
app.use(expressLayouts);
/* Assigns setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of 
the server. These special names are listed in the app settings table. (In this case, "view engine" determines The default engine 
extension to use when omitted.)*/
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false })); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

//Express Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
/* To setup your middleware, you can invoke app.use(<specific_middleware_layer_here>) for every middleware layer that you want to 
add (it can be generic to all paths, or triggered only on specific path(s) your server handles), and it will add onto your Express 
middleware stack.*/
app.use('/', require('./routes/index')); //basically: on the '/' address, run the required package
app.use('/users', require('./routes/users'))

/* In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port 
to listen on. 
So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.*/
const PORT = process.env.PORT || 5000;

/*When a program is running on a computer that uses TCP and waits for another computer to connect to it, it is said to be "listening"
for connections. The program attaches itself to a port on your computer and waits for a connection. When it does this it is what is
known as being in a listening state. When a remote computer connects to that particular port and "establishes" a connection, that 
particular sessions is known as an established session because the two computers are now connected to each other.*/ 
app.listen(PORT, console.log(`Server started on port ${PORT}`));