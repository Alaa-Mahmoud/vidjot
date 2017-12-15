const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Idea = require('../modles/Idea');
const { ensureAuthenticated } = require('../helpers/auth');

// route for adding ideas form
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('ideas/add');
});

// route for submit adea 
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ message: 'please add title' });
    }
    if (!req.body.details) {
        errors.push({ message: 'please add description' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };

        new Idea(newUser).save().then(idea => {
            req.flash('success_msg', 'video idea added');
            res.redirect('/ideas');
        });
    }


});

// listing ideas 
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id }).sort({ date: 'desc' })
        .then((ideas) => {
            res.render("ideas/index", { ideas: ideas });
        });
});

// edit specific idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({ _id: req.params.id }).then((idea) => {
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'You are Not Authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', { idea: idea });

        }
    });
});

// edit specific idea process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({ _id: req.params.id }).then((idea) => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then((idea) => {
            req.flash('success_msg', 'video idea updated');
            res.redirect("/ideas");
        });
    });
});

// delete specific idea 
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'video idea deleted');
        res.redirect("/ideas");
    });
});

module.exports = router;