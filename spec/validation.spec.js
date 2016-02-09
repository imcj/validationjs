var _ = require("underscore"),
    sprintf = require("sprintf-js").sprintf,
    constraints = require("../lib/constraints"),
    validation = require("../lib/validation"),
    result = require("../lib/result")

// 2016年2月6日
// 想要把写Library的过程写成一个故事

// 在validation-example中新增自定义约束

describe("RegistrationForm example", function() {
    validation.validator("RegistrationForm")
        .field("username")
            .label("Username")
            .example("imcj")
            .description("用户名必须是8到20位字母、数字和-_组成")
            .required()
            .alphaDash()
        .field("email")
            .label("EMail")
            .example("i@imcj.me")
            .description("务必输入正确的邮件地址，将会发送验证码校验邮件地址的正确性。")
            .email()
        .field("password")
            .label("Password")
            .example("1ab3c4")
            .description("用户的密码，登录时输入用户名和用户密码作为身份凭证。")
            .min(6)
            .required()
        .field("passwordAgain")
            .label("Password again")
            .example("1ab3c4")
            .description("重复输入密码校验两次输入都是同样的密码。")
            .confirmed("password")
    var registration = validation.validator("RegistrationForm").new()

    it("Should validate", function(done) {
        var form = {
            "username": "cj",
            "email": "i@imcj.me",
            "password": "1ab3c4",
            "passwordAgain": "1ab3c4"
        }

        registration.validate(form).then(function() {
            expect(registration.valid()).toBeTruthy()
            done()
        })
        .catch(function(error) {
            console.error(error.stack)
            done()
        })
    })

    it("Should wrong eamil", function(done) {
        var form = {
            "username": "cj",
            "email": "i@imcj",
            "password": "1ab3",
            "passwordAgain": "1ab3"
        }

        // 2016年2月6日
        // email字段的errors是空
        // 检查为字段push错误信息的代码
        // 原因是Field.validate的promise中的self = Validator

        registration.validate(form)
        .then(function() {
            expect(registration.email.errors[0].message)
                .toEqual("EMail 必须是电子邮件地址")
            expect(registration.valid()).toBeFalsy()
            expect(registration.email.errors.length).toEqual(1)
            done()
        })
        .catch(function(error) {
            // console.log(error.stack)
            done()
        })
    })

    it("Should wrong username", function() {
        var form = {
            "username": "",
            "email": "i@imcj.me",
            "password": "1ab3",
            "passwordAgain": "1ab3"
        }

        var assertFunction = function(result) {
            expect(result.valid()).toBeFalsy()
            done()
        }

        var catchFunction = function(error) {
            done()
        }

        registration.validate(form).then(assertFunction).catch(catchFunction)
    })
})


describe("Validation", function() {
    it("Should get single instance", function() {
        var first = validation.validator("Instance"),
           second = validation.validator("Instance")
        expect(first == second).toBeTruthy()
    })

    it("custom constraint", function(done) {
        var EqualOneConstraint = function(message) {
            this.validate = function(fieldName, fieldLabel, data) {
                return new Promise(function(resolve, reject) {
                    var error = new result.FieldError(fieldName, fieldLabel, this.name,
                        "not equal one")

                    resolve([error])
                })
            }
        }
        EqualOneConstraint.constraintName = "equalOne"

        validation.validator("EqualOne")
            .addConstraint(EqualOneConstraint)
            .field("equalOne")
                .equalOne()
        var equalOne = validation.validator("EqualOne").new()

        equalOne.validate({equalOne: 2}).then(function() {
            expect(equalOne.valid()).toBeFalsy()
            done()
        }).catch(function(error) {
            console.log(error)
            done()
        })

    })
})

// 2016年2月6日
// 注释了下面的代码，修改了原本的设计，Field的测试代码也会分为两个部份

// describe("Field", function() {
//     var fieldFactory = new validation.FieldFactory()
//     it("Should field", function(done) {
//         var field = fieldFactory.field("name",
//             validation.ValidatorDefinition.validators)
//         field.required().min(10)
//         console.log(field)
//         field.validate({name: null}).then(function(errors) {
//             expect(errors.length).toEqual(2)
//
//             done()
//         }).catch(function(error) {
//             done()
//         })
//     })
// })

// describe("FieldFactory", function() {
//     var fieldFactory = new validation.FieldFactory()
//
//     // TODO
//     // 自定义验证器可以覆盖默认的验证器
//     it("shoud create field", function() {
//         var field = fieldFactory.field("name",
//             validation.ValidatorDefinition.validators)
//         field.required()
//         expect(field.validators.length).toEqual(1)
//     })
// })

// describe("ValidationDefinition", function() {
//     it("example", function() {
//         var registrationMeta = validation.ValidatorDefinition("Registration")
//         var registration = registrationMeta.new()
//         expect(registration).toEqual(1)
//         // registration
//         //     .validate({"username": "imcj"})
//         //     .then(function(registration) {
//         //         expect(registration.username.hasErrors()).toBeFalsy()
//         // })
//     })
// })

// Now let do it
// Field是不是需要提供validate的链式调用到Validation.validate
describe("Field", function() {
    it("constructor", function(done) {

        var field = new validation.Field("name")
        field.addConstraint(new constraints.RequiredConstraint())
        field.setLabel("Name")

        var data = {"name": null}

        expect(field.constraints[0]
            .validate("name", "Name", data).length)
            .toEqual(1)

        field.validate(data).then(function(errors) {
            expect(field.hasErrors()).toBeTruthy()
            expect(errors[0].message).toEqual('Name 是必需的字段。')
            done()
        })
    })
})

describe("utilities", function() {
    it("call constributor", function() {
        var confirmed =  constraints.ConfirmedConstraint
        var validator = new (Function.prototype.bind.apply(confirmed,
            [null, "passwordAgain", "message"]))
        expect(validator.message).toEqual("message")
        expect(validator.hasOwnProperty("anotherField")).toBeTruthy()
    })
})
