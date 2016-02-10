var constraints = require("../lib/constraints")
    validation = require("../lib/validation")

describe("Required", function() {
    var validator = new constraints.RequiredConstraint()

    it("should right name", function() {
        expect(constraints.RequiredConstraint.constraintName).toEqual("required")
    })

    it("should validate", function() {
        var errors = validator.validate("required", "Required",
            {"required": null})
        expect(errors.length).toEqual(1)
    })

    it("should not pass value is undefined", function() {
        var errors = validator.validate("required", "Required",
            {"name": undefined})
        expect(errors.length).toEqual(1)
    })

    it("should not pass key not exists", function() {
        var errors = validator.validate("required", "Required", {})
        expect(errors.length).toEqual(1)
    })

    it("should pass", function() {
        var errors = validator.validate("required", "Required",
            {"required": "yes"})
        expect(errors.length).toEqual(0)
    })
})

describe("String", function() {
    var nameField = null
    var stringValidator
    beforeEach(function() {
        stringValidator = new constraints.StringConstraint()
    })

    it("Should right name", function() {
        expect(constraints.StringConstraint.constraintName).toEqual("string")
    })

    it("Should is string", function() {
        var errors = stringValidator.validate("name", "名字", {"name": "cj"})
        expect(errors.length).toEqual(0)
    })

    it("Should is not string", function() {
        var errors = stringValidator.validate("name", "名字", {"name": null})
        expect(errors.length).toEqual(1)
    })
})

describe("Integer", function() {
    var integerValidator
    beforeEach(function() {
        integerValidator = new constraints.IntegerConstraint()
    })

    it("Should right name", function() {
        expect(constraints.IntegerConstraint.constraintName).toEqual("integer")
    })

    it("Should is integer", function() {
        var errors = integerValidator.validate("age", "年龄", {"age": null})
        expect(errors.length == 1).toBeTruthy()
    })

    it("Should is integer if float", function() {
        var errors = integerValidator.validate("age", "年龄", {"age": 10.1})
        expect(errors.length == 1).toBeTruthy()
    })
})

describe("Array", function() {
    var arrayValidator
    beforeEach(function() {
        arrayValidator = new constraints.ArrayConstraint()
    })

    it("Should right name", function() {
        expect(constraints.ArrayConstraint.constraintName).toEqual("array")
    })

    it("Should is array", function() {
        var errors = arrayValidator.validate("images", "图片", {"images": []})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is array when image is null", function() {
        var errors = arrayValidator.validate("images", "图片",
            {"images": "null"})
        expect(errors.length > 0).toBeTruthy()
    })

    // TODO
    // 可以检查数组项的类型
})

describe("Numeric", function() {
    var numericValidator
    beforeEach(function() {
        numericValidator = new constraints.NumericConstraint()
    })

    it("Should right name", function() {
        expect(constraints.NumericConstraint.constraintName).toEqual("numeric")
    })

    it("Should is integer", function() {
        var errors = numericValidator.validate("age", "年龄", {"age": null})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should is integer if float", function() {
        var errors = numericValidator.validate("age", "年龄", {"age": 10.1})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is integer if integer", function() {
        var errors = numericValidator.validate("age", "年龄", {"age": 10})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is integer if string", function() {
        var errors = numericValidator.validate("age", "年龄", {"age": "10"})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is integer if string but not numeric", function() {
        var errors = numericValidator.validate("age", "年龄", {"age": "10a"})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Alpha", function() {
    var alphaValidator
    beforeEach(function() {
        alphaValidator = new constraints.AlphaConstraint()
    })

    it("Should right name", function() {
        expect(constraints.AlphaConstraint.constraintName).toEqual("alpha")
    })

    it("Should is alpha", function() {
        var errors = alphaValidator.validate("username", "用户名",
            {"username": "cj"})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is alpha but not", function() {
        var errors = alphaValidator.validate("username", "用户名",
            {"username": "30"})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should is alpha but is null", function() {
        var errors = alphaValidator.validate("username", "用户名",
            {"username": null})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Alpha numeric", function() {
    var alphaNumericValidator = null
    beforeEach(function() {
        alphaNumericValidator = new constraints.AlphaNumericConstraint()
    })

    it("Should right name", function() {
        expect(constraints.AlphaNumericConstraint.constraintName)
            .toEqual("alphaNumeric")
    })

    it("Should is alpha numeric", function() {
        var errors = alphaNumericValidator.validate("username", "用户名",
            {"username": "cj01"})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is alpha numeric but not", function() {
        var errors = alphaNumericValidator.validate("username", "用户名",
            {"username": "30 "})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should is alpha numeric but is null", function() {
        var errors = alphaNumericValidator.validate("username", "用户名",
            {"username": null})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Alpha numeric space", function() {
    var alphaNumericSpaceValidator = null
    beforeEach(function() {
        alphaNumericSpaceValidator = new constraints.AlphaNumericSpaceConstraint()
    })

    it("Should right name", function() {
        expect(constraints.AlphaNumericSpaceConstraint.constraintName)
            .toEqual("alphaNumericSpace")
    })

    it("Should is alpha numeric", function() {
        var errors = alphaNumericSpaceValidator.validate("username", "用户名",
            {"username": "cj11 "})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is alpha numeric space but not", function() {
        var errors = alphaNumericSpaceValidator.validate("username", "用户名",
            {"username": "cj11 -"})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should is alpha numeric but is null", function() {
        var errors = alphaNumericSpaceValidator.validate("username", "用户名",
            {"username": null})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Alpha dash", function() {
    var alphaDashValidator = null
    beforeEach(function() {
        alphaDashValidator = new constraints.AlphaDashConstraint()
    })

    it("Should is right name", function() {
        expect(constraints.AlphaDashConstraint.constraintName)
            .toEqual("alphaDash")
    })

    it("Should is alpha dash space", function() {
        var errors = alphaDashValidator.validate("username", "用户名",
            {"username": "cj11-"})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should is alpha dash but not", function() {
        var errors = alphaDashValidator.validate("username", "用户名",
            {"username": "30 -"})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should is alpha dash but is null", function() {
        var errors = alphaDashValidator.validate("username", "用户名",
            {"username": null})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Boolean", function() {
    var booleanValidator = null
    beforeEach(function() {
        booleanValidator = new constraints.BooleanConstraint()
    })

    it("Should right name", function() {
        expect(constraints.BooleanConstraint.constraintName).toEqual("boolean")
    })

    it("Shoud is boolean", function() {
        var errors = booleanValidator.validate("agree", "同意协议",
            {"agree": true})
        expect(errors.length > 0).toBeFalsy()

        var errors = booleanValidator.validate("agree", "同意协议",
            {"agree": 1})
        expect(errors.length > 0).toBeFalsy()

        var errors = booleanValidator.validate("agree", "同意协议",
            {"agree": "true"})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Between", function() {
    var betweenValidator = new constraints.BetweenConstraint(1, 20)

    it("Should right name", function() {
        expect(constraints.BetweenConstraint.constraintName).toEqual("between")
    })

    it("Should is range", function() {
        var errors = betweenValidator.validate("age", "年龄", {"age": 18})
        expect(errors.length > 0).toBeFalsy()
        var errors = betweenValidator.validate("age", "年龄", {"age": 0})
        expect(errors.length > 0).toBeTruthy()
        var errors = betweenValidator.validate("age", "年龄", {"age": 21})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("Max and min", function() {
    it("max", function() {
        var maxValidator = new constraints.MaxConstraint(99)

        expect(constraints.MaxConstraint.constraintName).toEqual("max")

        var errors = maxValidator.validate("age", "年龄", {"age": 18})
        expect(errors.length > 0).toBeFalsy()
        var errors = maxValidator.validate("age", "年龄", {"age": 100})
        expect(errors.length > 0).toBeTruthy()
    })

    it("min", function() {
        var minValidator = new constraints.MinConstraint(18)

        expect(constraints.MinConstraint.constraintName).toEqual("min")

        var errors = minValidator.validate("age", "年龄", {"age": 17})
        expect(errors.length > 0).toBeTruthy()
        var errors = minValidator.validate("age", "年龄", {"age": 18})
        expect(errors.length > 0).toBeFalsy()
    })
})

describe("TrueValidator", function() {
    var trueValidator = new constraints.TrueConstraint()
    it("Should vlaidate", function() {
        expect(constraints.TrueConstraint.constraintName).toEqual("true")

        var errors = trueValidator.validate("true", "真实", {"true": true})
        expect(errors.length > 0).toBeFalsy()
        var errors = trueValidator.validate("true", "真实", {"true": false})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("FalseValidator", function() {
    var falseValidator = new constraints.FalseConstraint()

    it("Should validate", function() {

        expect(constraints.FalseConstraint.constraintName).toEqual("false")

        var errors = falseValidator.validate("true", "真实", {"true": false})
        expect(errors.length > 0).toBeFalsy()
        var errors = falseValidator.validate("true", "真实", {"true": true})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("YesValidator", function() {
    var trueValidator = new constraints.YesConstraint()

    it("Should validate", function() {

        expect(constraints.YesConstraint.constraintName).toEqual("yes")

        var errors = trueValidator.validate("true", "真实", {"true": true})
        expect(errors.length < 1).toBeTruthy()
        var errors = trueValidator.validate("true", "真实", {"true": false})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("NoValidator", function() {
    var noValidator = new constraints.NoConstraint()

    it("Should validate", function() {

        expect(constraints.NoConstraint.constraintName).toEqual("no")

        var errors = noValidator.validate("true", "真实", {"true": false})
        expect(errors.length > 0).toBeFalsy()
        var errors = noValidator.validate("true", "真实", {"true": true})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("GreaterValidator", function() {
    var greaterValidator = new constraints.GreaterConstraint(11)

    it("Should greater", function() {
        expect(constraints.GreaterConstraint.constraintName).toEqual("greater")

        var errors = greaterValidator.validate("age", "年龄", {"age": 10})
        expect(errors.length > 0).toBeTruthy()

        errors = greaterValidator.validate("age", "年龄", {"age": 11})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("GreaterThanValidator", function() {
    var greaterThanValidator = new constraints.GreaterThanConstraint(11)

    it("Should greater than", function() {
        expect(constraints.GreaterThanConstraint.constraintName)
            .toEqual("greaterThan")
        var errors = greaterThanValidator.validate("age", "年龄", {"age": 11})
        expect(errors.length < 1).toBeTruthy()

        errors = greaterThanValidator.validate("age", "年龄", {"age": 10})
        expect(errors.length < 1).toBeFalsy()
    })
})

describe("LessValidator", function() {
    var lessValidator = new constraints.LessConstraint(100)
    var lessThanValidator = new constraints.LessThanConstraint(100)

    it("Should less", function() {
        expect(constraints.LessConstraint.constraintName).toEqual("less")

        var errors = lessValidator.validate("age", "年龄", {"age": 99})
        expect(errors.length > 0).toBeFalsy()

        errors = lessValidator.validate("age", "年龄", {"age": 100})
        expect(errors.length < 1).toBeFalsy()
    })

    it("Should less than", function() {
        expect(constraints.LessThanConstraint.constraintName).toEqual("lessThan")

        var errors = lessThanValidator.validate("age", "年龄", {"age": 99})
        expect(errors.length > 0).toBeFalsy()

        errors = lessThanValidator.validate("age", "年龄", {"age": 100})
        expect(errors.length > 0).toBeFalsy()

        errors = lessThanValidator.validate("age", "年龄", {"age": 101})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("JSON validator", function() {
    var jsonValidator = new constraints.JSONConstraint()

    it("Should json", function() {
        expect(constraints.JSONConstraint.constraintName).toEqual("json")

        var errors = jsonValidator.validate("json", "JSON",
            {"json": "{\"yes\":true}"})
        expect(errors.length > 0).toBeFalsy()
    })

    it("Should json failure", function() {
        var errors = jsonValidator.validate("json", "JSON",
            {"json": "{yes:true"})
        expect(errors.length > 0).toBeTruthy()
    })
})

describe("In or not in validator", function() {
    var inValidator = new constraints.InConstraint(["en", "zh", "jp"]),
     notInValidator = new constraints.NotInConstraint(["en", "zh", "jp"])

    it("Should in", function() {
        expect(constraints.InConstraint.constraintName).toEqual("in")

        var errors =
        inValidator.validate("language", "语言", {"language": "en"})
        expect(errors.length > 0).toBeFalsy()

        errors =
        inValidator.validate("language", "语言", {"language": "de"})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Should not in", function() {
        expect(constraints.NotInConstraint.constraintName).toEqual("notIn")

        var errors =
            notInValidator.validate("language", "语言", {"language": "en"})
        expect(errors.length > 0).toBeTruthy()

        errors =
            notInValidator.validate("language", "语言", {"language": "de"})
        expect(errors.length > 0).toBeFalsy()
    })
})

describe("EMail", function() {
    var emailConstraint = new constraints.EMailConstraint()

    it("Shoud email", function() {
        expect(constraints.EMailConstraint.constraintName).toEqual("email")

        var errors = emailConstraint.validate("email", "电子邮件",
            {"email": "i@imcj.me"})
        expect(errors.length == 0).toBeTruthy()

        errors = emailConstraint.validate("email", "电子邮件",
            {"email": "i@imcj"})
        expect(errors.length).toEqual(1)

        errors = emailConstraint.validate("email", "电子邮件",
            {"email": "iimcj.me"})
        expect(errors.length == 1).toBeTruthy()
    })
})

describe("Confirmed and different", function() {

    it("Confirmed", function() {
        var validator = new constraints.ConfirmedConstraint("password")
        expect(constraints.ConfirmedConstraint.constraintName).toEqual("confirmed")

        var errors = validator.validate("passwordAgain", "重新输入密码",
            {"password": "123", "passwordAgain": "123"})
        expect(errors.length > 0).toBeFalsy()

        errors = validator.validate("passwordAgain", "重新输入密码",
            {"password": "123", "passwordAgain": "321"})
        expect(errors.length > 0).toBeTruthy()
    })

    it("Different", function() {
        var validator = new constraints.DifferentConstraint("first")
        expect(constraints.DifferentConstraint.constraintName)
            .toEqual("different")

        var errors = validator.validate("second", "Second",
            {"first": 1, "second": 2})
        expect(errors.length < 1).toBeTruthy()

        errors = validator.validate("second", "Second",
            {"first": 1, "second": 1})
        expect(errors.length < 1).toBeFalsy()
    })
})

describe("Ip validator", function() {
    it("Should is ipv4 address", function() {
        var validator = new constraints.IPConstraint()
        expect(constraints.IPConstraint.constraintName).toEqual("ip")

        var errors = validator.validate("ip", "IP",
            {"ip": "127.0.0.1"})
        expect(errors.length < 1).toBeTruthy()

        errors = validator.validate("ip", "IP",
            {"ip": "127.0.0."})
        expect(errors.length < 1).toBeFalsy()
    })
})

describe("Regexpress validator", function() {
    it("Should valid", function() {
        var validator = new constraints.RegexConstraint(/^\d+$/, "必需是数字")
        expect(constraints.RegexConstraint.constraintName).toEqual("regex")

        var errors = validator.validate("age", "Age",
            {"age": "30"})
        expect(errors.length < 1).toBeTruthy()
        errors = validator.validate("age", "Age",
            {"age": "30a"})
        expect(errors.length < 1).toBeFalsy()
        expect(errors[0].message).toEqual("必需是数字")
    })
})

describe("Digits", function() {
    it("Should exact length", function() {
        var validator = new constraints.DigitsConstraint(4)
        expect(constraints.DigitsConstraint.constraintName).toEqual("digits")
        var errors = validator.validate("secret", "Secret", {"secret": 6688})
        expect(errors.length < 1).toBeTruthy()

        errors = validator.validate("secret", "Secret", {"secret": 66888})
        expect(errors.length < 1).toBeFalsy()
    })

    it("Should between the given min and max", function() {
        var validator = new constraints.DigitsBetweenConstraint(18, 30)
        expect(constraints.DigitsBetweenConstraint.constraintName)
            .toEqual("digitsBetween")
        var errors = validator.validate("age", "Age", {age: 18})
        expect(errors.length < 1).toBeTruthy()
        errors = validator.validate("age", "Age", {age: 30})
        expect(errors.length < 1).toBeTruthy()
        errors = validator.validate("age", "Age", {age: 17})
        expect(errors.length < 1).toBeFalsy()
        errors = validator.validate("age", "Age", {age: 31})
        expect(errors.length < 1).toBeFalsy()
    })
})

describe("URL", function() {
    it("Should is url", function() {
        var validator = new constraints.URLConstraint()
        expect(constraints.URLConstraint.constraintName).toEqual("url")

        var errors = validator.validate("url", "URL",
            {"url": "http://github.com"})
        expect(errors.length < 1).toBeTruthy()
        errors = validator.validate("url", "URL",
            {"url": "http://github"})
        expect(errors.length < 1).toBeFalsy()
    })
})
