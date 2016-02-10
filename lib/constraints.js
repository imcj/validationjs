"use strict";

var FieldError = require("./validation").FieldError
var sprintf = require("sprintf-js").sprintf

function isArray(array) {
    return Object.prototype.toString.call( array ) === '[object Array]'
}

function isString(value) {
    return typeof(value) == 'string' || value instanceof String
}

// ref
// http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
function isInt(value) {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

// ref
// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


var clean = function(data, fieldName) {
    if (!data.hasOwnProperty(fieldName))
        return null
    if (!data[fieldName])
        return null
    return data[fieldName]
}

module.exports.RequiredConstraint = function(message) {
    if (!message)
        message = "%(name)s 是必需的字段。"
    this.message = message
    this.validate = function(fieldName, fieldLabel, data) {
        var success = data != null && data != undefined &&
            data.hasOwnProperty(fieldName) && data[fieldName]

        var errors = []
        if (!success) {
            var error = new FieldError(fieldName, fieldLabel,
                this.constructor.constraintName,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.RequiredConstraint.constraintName = "required"

module.exports.StringConstraint = function() {
    this.message = "%(name)s 必须是字符串类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []
        var yes = isString(value)
        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.StringConstraint.constraintName = "string"

module.exports.IntegerConstraint = function() {
    this.message = "%(name)s 必须是整数类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = isInt(value)
        var errors = []
        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.IntegerConstraint.constraintName = "integer"

module.exports.NumericConstraint = function() {
    this.message = "%(name)s 必须是数字类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = isNumeric(value)
        var errors = []
        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.NumericConstraint.constraintName = "numeric"

module.exports.ArrayConstraint = function() {
    this.message = "%(name)s 必须是数组类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = Object.prototype.toString.call( value ) === '[object Array]'
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.ArrayConstraint.constraintName = "array"

var alphaRegularExpression = /^[a-zA-Z]+$/
module.exports.AlphaConstraint = function() {
    this.message = "%(name)s 只能包含字符"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = value && alphaRegularExpression.test(value)
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.AlphaConstraint.constraintName = "alpha"

var alphaNumericRegularExpression = /^[a-zA-Z0-9]+$/
module.exports.AlphaNumericConstraint = function() {
    this.message = "%(name)s 只能包含字符和数字"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = value && alphaNumericRegularExpression.test(value)
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.AlphaNumericConstraint.constraintName = "alphaNumeric"

var alphaNumericSpaceRegularExpression = /^[a-zA-Z0-9 ]+$/
module.exports.AlphaNumericSpaceConstraint = function() {
    this.message = "%(name)s 只能包含字符、数字和空格"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = value && alphaNumericSpaceRegularExpression.test(value)
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.AlphaNumericSpaceConstraint.constraintName = "alphaNumericSpace"

var alphaDashRegularExpression = /^[a-zA-Z0-9\-_]+$/
module.exports.AlphaDashConstraint = function() {
    this.message = "%(name)s 只能包含字符、数字、、-和_"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = value && alphaDashRegularExpression.test(value)
        var errors = []
        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.AlphaDashConstraint.constraintName = "alphaDash"

module.exports.BooleanConstraint = function() {
    this.message = "%(name)s 只能是布尔类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = typeof value == "boolean" || typeof value == "number"
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.BooleanConstraint.constraintName = "boolean"

module.exports.BetweenConstraint = function(min, max, message) {
    this.min = min
    this.max = max
    if (!message)
        message = "%(name)s 数字需要在%(min)d 和 %(max)d之间"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        if (!this.min || !this.max)
            throw new Error("必须包含min和max参数")

        var value = clean(data, fieldName)
        var yes = value >= this.min && value <= this.max
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel, min: this.min,
                                       max: this.max}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.BetweenConstraint.constraintName = "between"

module.exports.TrueConstraint = function() {
    this.message = "%(name)s 必须是true"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = value == true
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.TrueConstraint.constraintName = "true"

module.exports.FalseConstraint = function() {
    this.message = "%(name)s false"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (value == true) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.FalseConstraint.constraintName = "false"

module.exports.YesConstraint = function() {
    this.message = "%(name)s yes"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (value != true) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.YesConstraint.constraintName = "yes"

module.exports.NoConstraint = function() {
    this.message = "%(name)s no"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (value == true) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.NoConstraint.constraintName = "no"

module.exports.GreaterConstraint = function(comparand, message) {
    if (!message)
        message = "%(name)s 必需大于 %(comparand)d"
    this.message = message
    this.comparand = comparand

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO if not number throw an Error
        if (value <= this.comparand) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel,
                                       comparand: this.comparand}))

            errors.push(error)
        }

        return errors
    }
}
module.exports.GreaterConstraint.constraintName = "greater"

module.exports.GreaterThanConstraint = function(comparand, message) {
    if (!message)
        message = "%(name)s 必需大于等于 %(comparand)d"
    this.message = message
    this.comparand = comparand

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO if not number throw an Error
        if (value < this.comparand) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel,
                                       comparand: this.comparand}))

            errors.push(error)
        }

        return errors
    }
}
module.exports.GreaterThanConstraint.constraintName = "greaterThan"

module.exports.LessConstraint = function(comparand, message) {
    if (!message)
        message = "%(name)s 必需小于 %(comparand)d"
    this.message = message
    this.comparand = comparand

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO if not number throw an Error
        if (value >= this.comparand) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel, comparand: comparand}))

            errors.push(error)
        }

        return errors
    }
}
module.exports.LessConstraint.constraintName = "less"

module.exports.LessThanConstraint = function(comparand, message) {
    if (!message)
        message = "%(name)s 必需小于等于 %(comparand)d"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO if not number throw an Error
        if (value > comparand) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel, comparand: comparand}))

            errors.push(error)
        }

        return errors
    }
}
module.exports.LessThanConstraint.constraintName = "lessThan"

module.exports.DecimalConstraint = function() {
    this.message = "%(name)s 必须是整数类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = isInt(value)
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.DecimalConstraint.constraintName = "decimal"

module.exports.DateValidator = null
module.exports.DateTimeValidator = null
module.exports.DateFormatValidator = null
module.exports.TimeValidator = null

module.exports.JSONConstraint = function() {
    this.message = "%(name)s 必须是JSON类型"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var yes = false
        try {
            JSON.parse(value)
            yes = true
        } catch (e) {
        }
        var errors = []
        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.JSONConstraint.constraintName = "json"

module.exports.InConstraint = function(list, message) {
    this.list = list
    if (!message)
        message = "%(name)s 必须必须在 %(list)s 中"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var listDescription = "[ " + this.list.join(", ") + " ]"
        var yes = false

        if (isArray(list)) {
            for (var i = 0, size = list.length; i < size; i++) {
                var item = list[i]
                if (item == value) {
                    yes = true
                    break
                }
            }
        }
        var errors = []

        if (!yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message,
                         {name: fieldLabel, list: listDescription}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.InConstraint.constraintName = "in"

module.exports.NotInConstraint = function(list, message) {
    this.list = list
    if (!message)
        message = "%(name)s 必须必须在 %(list)s 中"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO 检查 argument并抛出异常
        var listDescription = "[ " + list.join(", ") + " ]"
        var yes = false

        if (isArray(list)) {
            for (var i = 0, size = list.length; i < size; i++) {
                var item = list[i]
                if (item == value) {
                    yes = true
                    break
                }
            }
        }

        if (yes) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message,
                        {name: fieldLabel, list: listDescription}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.NotInConstraint.constraintName = "notIn"

module.exports.SizeValidator = null
module.exports.ImageValidator = null

module.exports.DigitsConstraint = function(length, message) {
    if (!message)
        message = "%(name)s 的长度必需是 %(length)d 位。"

    this.message = message
    this.length = length

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (String(value).length != this.length) {
            var outputMessage = sprintf(this.message,
                {name: fieldLabel, length: this.length})
            var error = new FieldError(fieldName, fieldLabel,
                this.name, outputMessage)

            errors.push(error)
        }

        return errors
    }
}
module.exports.DigitsConstraint.constraintName = "digits"

module.exports.DigitsBetweenConstraint = function(min, max, message) {
    if (!message)
        message = "%(name)s 必需在 %(min)d 和 %(max)d 之间。"

    this.message = message
    this.min = min
    this.max = max

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (value < this.min || value > this.max) {
            var outputMessage = sprintf(this.message,
                {name: fieldLabel, min: this.min, max: this.max})
            var error = new FieldError(fieldName, fieldLabel,
                this.name, outputMessage)

            errors.push(error)
        }

        return errors
    }
}
module.exports.DigitsBetweenConstraint.constraintName = "digitsBetween"

module.exports.DifferentConstraint = function(anotherField, message) {
    if (!message)
        message = "%(name)s 和 %(field)s 字段的值必须不一致"
    this.message = message
    this.anotherField = anotherField

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var anotherFieldValue = clean(data, this.anotherField)
        var errors = []

        if (value == anotherFieldValue) {
            var outputMessage = sprintf(this.message,
                {name: fieldLabel, field: this.anotherField})
            var error = new FieldError(fieldName, fieldLabel,
                this.name, outputMessage)


            errors.push(error)
        }

        return errors
    }
}
module.exports.DifferentConstraint.constraintName = "different"

module.exports.ConfirmedConstraint = function(anotherField, message) {
    if (!message)
        message = "%(name)s 和 %(field)s 字段的值不一致 "
    this.message = message
    this.anotherField = anotherField

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var anotherFieldValue = clean(data, this.anotherField)
        var errors = []
        if (value != anotherFieldValue) {
            var outputMessage = sprintf(this.message,
                {name: fieldLabel, field: this.anotherField})
            var error = new FieldError(fieldName, fieldLabel,
                this.name, outputMessage)


            errors.push(error)
        }

        return errors
    }
}
module.exports.ConfirmedConstraint.constraintName = "confirmed"

module.exports.EMailConstraint = function() {
    this.message = "%(name)s 必须是电子邮件地址"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            return [error]
        }

        return []
    }
}
module.exports.EMailConstraint.constraintName = "email"

module.exports.MaxConstraint = function(max, message) {
    this.max = max
    if (!message)
        message = "%(name)s 必须大于 %(max)d"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO
        // 参数不正确的异常
        if (value > this.max) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel, max: this.max}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.MaxConstraint.constraintName = "max"

module.exports.MinConstraint = function(min, message) {
    this.min = min
    if (!message)
        message = "%(name)s 必须大于 %(min)d"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // TODO
        // 参数不正确的异常
        var errors = []
        if (null == value || (value < this.min && isNumeric(value)) ||
            (value.length < this.min && isString(value))) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel, min: this.min}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.MinConstraint.constraintName = "min"

module.exports.IPConstraint = function() {
    this.message = "%(name)s 必须是IP地址"

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        // ref
        // http://stackoverflow.com/questions/10006459/regular-expression-for-ip-address-validation
        var ipRegularExpress = /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/g
        if (!ipRegularExpress.test(value)) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.IPConstraint.constraintName = "ip"

module.exports.RegexConstraint = function(regularExpress, message) {
    this.message = "%(name)s 不满足正则表达式"
    this.regularExpress = regularExpress
    if (message)
        this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (!this.regularExpress.test(value)) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.RegexConstraint.constraintName = "regex"

var urlRegularExpress = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
module.exports.URLConstraint = function(message) {
    if (!message)
        message = "%(name)s 必需是URL"
    this.message = message

    this.validate = function(fieldName, fieldLabel, data) {
        var value = clean(data, fieldName)
        var errors = []

        if (!urlRegularExpress.test(value)) {
            var error = new FieldError(fieldName, fieldLabel, this.name,
                sprintf(this.message, {name: fieldLabel}))

            errors.push(error)
        }
        return errors
    }
}
module.exports.URLConstraint.constraintName = "url"

module.exports.FieldError = FieldError
module.exports.isString = isString
module.exports.isArray = isArray
