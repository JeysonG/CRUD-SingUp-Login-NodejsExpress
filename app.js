const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieparser = require('cookie-parser');
//20 abril
let logistica = require('./logistica')('Yucas la 4');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

require('./config/passport')(passport);

const app = express();

//21 abril
app.get("/nuclear", (req, res) => {
    
    let estadoEmpaquetar = logistica.estadoEmpaquetar();

    if(estadoEmpaquetar.funciona){

        res.json(logistica.empaquetar(60));

    }
    else{
        res.json({"error": true, "descripcion": estadoEmpaquetar.descripcion});
    }
});

app.use(cookieparser());

//Bring in Models
let Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'pug');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

//Express Sesion
app.use(session({
    secret: 'jeysoon99',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Express Messages
app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Read All Home route
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err){
            console.log(err)
        } else {
            res.render('index.pug', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

//route files
let articles = require('./routes/articles');
//let users = require('./routes/users');
app.use('/articles', articles);
//app.use('/users', users);

require('./routes/routeuser.js')(app, passport);

app.listen(3000, function(){
    console.log('Server running on port 3000');
});