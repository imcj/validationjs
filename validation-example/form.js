var validator = require("../validation"),
    constraints = require('./constraints')

var registration = validator("RegistrationForm")
    .field("email")
        .description("电子邮件地址")
    // /*
        .example('example@example.com')
        .placeholder('example@example.com')
        .email()
        .addConstraint(new constraints.UniqueUsernameConstraint())
    .field("password")
        .description("密码")
        .example('a1ek')
        .placeholder("请输入密码")
        .required()
        .min(4)
    .field("passwordAgain")
        .description("请重复输入密码")
        .example('a1ek')
        .placeholder("请重复输入密码")
        .confirmed("password")
        .required()
    // */

module.exports.registration = registration
