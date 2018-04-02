const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthentication } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');
// Idea route
router.get('/', ensureAuthentication, (req, res) => {
    Idea.find({
        user: req.user.id
    })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas,
                usr: req.user.name
            });
        });
});
// Add Idea Form route
router.get('/add', ensureAuthentication, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/users/login');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        })
});

router.post('/', ensureAuthentication, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Add title to the form' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Add details to the form' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        // When the form is passed we need to save it in the database
        const idea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        req.flash('success_msg', 'Video idea added');
        new Idea(idea).save()
            .then(idea => res.redirect('/ideas'));
    }
});

// Edit form process
router.put('/:id', ensureAuthentication, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // new values
            req.flash('success_msg', 'Video idea updated');
            idea.title = req.body.title;
            idea.details = req.body.details;

            Idea(idea).save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        });
});
// Delete Messages
router.delete('/:id', ensureAuthentication, (req, res) => {
    req.flash('success_msg', 'Video idea removed');
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            res.redirect('/ideas');
        })
});


module.exports = router;