const express = require('express');
const router = express.Router();

//Bring in Article Model
let Article = require('../models/article');

//View Create
router.get('/add', function(req,res){
    res.render('add_article.pug', {
        title: 'Add Article'
    });
});

//Create
router.post('/add', function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.render('add_article.pug', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('message', 'Article Added');
                res.redirect('/');
            }
        });
    }
});



//Read for _id
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('article.pug', {
            article: article
        });
    });
});

//View Update
router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article.pug', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Update
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('message', 'Article Edited');
            res.redirect('/');
        }
    });
});

//Delete
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        } else {
            res.send('Success');
        }
    })
});

module.exports = router;