module.exports = function(app, passport){

    app.get('/users/login', function(req, res){
        res.render('login.pug');
    });

    app.post('/users/login', validateLogin, passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/users/login',
            failureFlash: true
        }),
        function(req, res){
            res.render('login.pug', {
                messages: req.flash('messagesalert')
            });
        }
    );

    app.get('/users/register', function(req, res){
        res.render('register.pug');
    });

    app.post('/users/register', validateSingup, passport.authenticate('local-singup', {
        successRedirect: '/profile',
        failureRedirect: '/users/register',
        failureFlash: true
    }),
    function(req, res){
        res.render('register.pug', {
            messages: req.flash('messagesalert')
        });
    }
);

    //View profile
    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.pug', {
            user: req.user
        });
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/users/login');
    });

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/users/login');
    }

    function validateSingup(req, res, next){
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
            return next();
        }
    };

    function validateLogin(req, res, next){
        const username = req.body.username;
        const password = req.body.password;

        req.checkBody('username', 'Username is Required').notEmpty();
        req.checkBody('password', 'Password is Required').notEmpty();
        
        let errors = req.validationErrors();

        if(errors){
            res.render('login.pug', {
                errors:errors
            });
        } else {
            return next();
        }
    };
}