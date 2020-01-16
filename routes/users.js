const express = require('express');

//Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system
const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
//What is a model, document, schema? Check https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/
const User  = require('../models/User')

//Login Page
/*router.methodtype (in this case, it is a get request)
Arrow functions – also called “fat arrow” functions, from CoffeeScript (a transcompiled language) — are a more concise syntax for 
writing function expressions.
res.send: Sends the HTTP response.*/
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields' }); //push method adds item to the end of an array
    }

    //Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    //res.render can also pass local variables to thew view, which is why messages.ejs can use "errors" list defined here
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email})
            .then(user => {
                if(user) { //if there's a user, re-render the register form and send error that says "user already exists"
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors, //this stands for errors: errors
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //Set password to hashed
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in!')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))

                }
            });

    }
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;