const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
require('../models/User');
const User = mongoose.model('users');

// Login route
router.get('/login', (req,res) => {
    res.render('users/login');
})

// Register route
router.get('/register', (req,res) => {
    res.render('users/register');
})
// Login form POST
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})
// Register form POST
router.post('/register', (req,res) => {
    let errors = [];
    if(req.body.password !== req.body.password2){
        errors.push({text:'Password Mismatch'});
    }
    if(req.body.password.length < 6){
        errors.push({text:'Password must be atleast 6 characters'});
    }
    if(errors.length > 0){
        res.render('users/register', {
            msg: errors[0],
            reg: req.body
        })
    } else{
        User.findOne({email: req.body.mail})
        .then(user => {
            if(user){
                req.flash('error_msg', 'User Id is already registered');
                res.redirect('/users/register');
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.mail,
                    password: req.body.password
                })
                bcryptjs.genSalt(10, (err,salt) => {
                    bcryptjs.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', `Hi ${user.name} Welcome to vidjot, Fun Innovating`)
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    })
                })
            }
        })
    }
})

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg', 'You have successfully logged out.');
    res.redirect('/users/login');
})
module.exports = router;