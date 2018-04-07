const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

//Bring in User Model
let User = require('../models/user');

//Register Form
router.get('/register', function(req, res){
    res.render('register.pug');
});

//Register Process
router.post('/register', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const paswword2 = req.body.password2;

    req.checkBody('name', 'Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('username', 'Username is Required').notEmpty();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);
    
    let errors = req.validationErrors();

    if(errors){
        res.render('register.pug', {
            errors:errors
        });
    } else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

//Login Form
router.get('/login', function(req, res){
    res.render('login.pug');
});

//Login Process
router.post('/login', function(req, res){
    const username = req.body.username;
    var password = req.body.password;

    req.checkBody('username', 'Username is Required').notEmpty();
    req.checkBody('password', 'Password is Required').notEmpty();
    
    let errors = req.validationErrors();

    if(errors){
        res.render('login.pug', {
            errors:errors
        });
    } else {
        User.findOne({'username': username}, function(err, user){
            if(err){
                console.log(err);
            }
            if(!user){
                console.log('No user found');
                res.redirect('/users/login');
                //return done(null, false, req.flash('loginMessage', 'No user found'));
            } else if(!user.validatePassword(password)){
                console.log('Wrong password');
                res.redirect('/users/login');
                //return done(null, false, req.flash('loginMessage', 'Wrong password'))
            } else {
                res.redirect('/users/profile');
            }
        });
    }
});

//View profile
router.get('/profile', function(req, res){
    res.render('profile.pug');
});

module.exports = router;