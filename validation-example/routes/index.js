var express = require('express');
var router = express.Router();
var form = require("../form"),
    User = require('../models').User,
    validator = require('../../'),
    crypto = require('crypto')

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
            .label('用户名')
            .description("电子邮件地址作为登录凭证")
            .placeholder('example@example.com')
            .required()
            .email()
        .field("password")
            .label("密码")
            .description("密码必须大于4位")
            .placeholder("请输入密码")
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
                        return ["错误的用户名或者密码"]
                    }
                })
            })
        .new()

    var render = function() {
        res.render('signin', {
            form: signin
        })
    }

    if ("POST" == req.method) {
        signin.validate(req.body).then(function() {
            render()
        })
    } else
        render()
})

module.exports = router;
