var express = require('express');
var router = express.Router();
var form = require("../form"),
    User = require('../models').User,
    validator = require('../../'),
    crypto = require('crypto'),
    debug = require('debug')("validationjs")

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

router.all('/signin', function(req, res) {
    var signin = validator("SigninForm")
        .field("username")
            .label('Username')
            .description("email address as login credentials")
            .placeholder('example@example.com')
            .required()
            .email()
        .field("password")
            .label("Password")
            .description("Password length must greater 4")
            .placeholder("Please type a strong password")
            .required()
            .min(4)
            .constraint(function(fieldName, fieldLabel, data) {
                var username = data['username'],
                    password = crypto
                        .createHmac('sha1', '')
                        .update(data['password'])
                        .digest('hex')

                var query = {
                    username: username,
                    hashedPassword: password
                }
                return User.findOne(query).then(function(user) {
                    if (null == user) {
                        return ["Wrong username or password"]
                    }
                }).catch(function(error) {
                    console.stack(error)
                })
            })
        .new()

    var render = function() {
        res.render('signin', {
            form: signin
        })
    }

    if ("POST" == req.method) {
        debug("/signin post")
        signin.validate(req.body).then(function() {
            if (signin.valid())
                res.render('signin_success')
            else
                render()
        }).catch(function(error) {
            debug(error)
            debug(error.stack)
        })
    } else
        render()
})

module.exports = router;
