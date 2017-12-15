const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../modles/User');
//User login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// User Register Form Post
router.post('/regsiter', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ message: "passwords do'nt match" });
    }

    if (req.body.password.length < 4) {
        errors.push({ message: "password must be at leats 4 chars" });
    }

    if (errors.length > 0) {
        res.render('users/regsiter', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,

        });
    } else {

        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash('error_msg', 'this email is already regstired');
                res.redirect('/users/login');
            } else {
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                };

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        new User(newUser).save().then((user) => {
                            req.flash('success_msg', 'You are now registered.');
                            res.redirect('/users/login');
                        }).catch((e) => {
                            return console.log(e);
                        });
                    });
                });
            }
        });



    }

});

// login form post 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// logout user

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/');
});


module.exports = router;