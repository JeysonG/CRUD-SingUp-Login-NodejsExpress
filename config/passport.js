const localStrategy = require('passport-local').Strategy;

//Bring in User Model
let User = require('../models/user');

module.exports = function (passport) {
    
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-singup', new localStrategy({
        nameField: 'name',
        emailField: 'email',
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done){
            User.findOne({'username': username}, function(err, user){
                const name = req.body.name;
                const email = req.body.email;
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, false, req.flash('messagesalert', 'The username is already taken'))
                } else {
                    var newUser = new User();
                    newUser.name = name;
                    newUser.email = email;
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err){
                            console.log(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        }
    ));

    passport.use('local-login', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done){
        User.findOne({'username': username}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, req.flash('messagesalert', 'No User Found'));
            }
            if(!user.validatePassword(password)){
                return done(null, false, req.flash('messagesalert', 'Wrong Password'));
            }
            return done(null, user);
        });            
    }));
}