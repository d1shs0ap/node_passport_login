const express = require('express');

//Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

//Wecome Page

//router.methodtype (in this case, it is a get request)
//Arrow functions – also called “fat arrow” functions, from CoffeeScript (a transcompiled language) — are a more concise syntax for 
//writing function expressions.
//res.send: Sends the HTTP response.
router.get('/', (req, res) => res.render('welcome')); //res.render: Renders a view (in views folder) and sends the rendered HTML string to the client.

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
    name: req.user.name
}));

module.exports = router;