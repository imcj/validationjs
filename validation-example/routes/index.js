var express = require('express');
var router = express.Router();
var form = require("../form"),
    User = require('../models').User

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', form: form.registration.new() });
});

router.post('/', function(req, res, next) {
    var registration = form.registration.new()

    registration.validate(req.body).then(function() {
        if (registration.valid()) {
            User.create(req.body).then(function() {
                res.render("OK")
            })
        } else {
            res.render('index', {
                title: 'Express', form: registration
            });
        }
    })
})

module.exports = router;
