'use strict;'

var _ = require("underscore"),
    constraints = require("./constraints"),
    debug = require("debug")("validationjs")


function returnPromise(result) {
    if (!(result instanceof Promise)) {
        return new Promise(function(resolve, reject) {
            resolve(result)
        })
    } else
        return result
}

function ValidatorProxy(validatorInstance) {
    this.validator = validatorInstance

    this.field = function(name) {
        var field = this.validator.field(name)

        return field
    }

    this.new = function() {
        return this.validator.new()
    }

    this.validate = function(data) {
        return this.validator.validate(data)
    }
}

var ConstraintFactory = function() {
    this.create = function(validatorClass, arguments) {
        var instance = new (Function.prototype.bind.apply(validatorClass,
            [null].concat(arguments)))
        return instance
    }
}

var FieldBase = function(name) {
    self = this
    this._name = name
    this.validators = []
    this._label = null
    this._description = null
    this._example = null
    this._placeholder = null
    this.constraints = []
    this._value = null

    this.getName = function() {
        return this._name
    }

    this.setExample = function(example) {
        this._example = example
    }

    this.getExample = function() {
        return this._example
    }

    this.setDescription = function(description) {
        this._description = description
    }

    this.getDescription = function() {
        return this._description
    }

    this.setPlaceholder = function(placeholder) {
        this._placeholder = placeholder
    }

    this.getPlaceholder = function() {
        return this._placeholder
    }

    this.setLabel = function(label) {
        this._label = label
    }

    this.getLabel = function() {
        return this._label
    }

    this.addConstraint = function(constraint) {
        this.constraints.push(constraint)
        return this
    }

    this.constraint = function(constraint) {
        var ConstraintClass = function() {
            this.validate = function(fieldName, fieldLabel, data) {

                var fieldErrorFromString = function(message) {
                    return new constraints.FieldError(fieldName, fieldLabel,
                        "anonymouse", message)
                }

                return returnPromise(constraint(fieldName, fieldLabel, data))
                .then(function(result) {
                    if (constraints.isString(result)) {
                        return fieldErrorFromString(result)
                    } else if (constraints.isArray(result)) {
                        var results = []
                        for (var i = 0, size = result.length; i < size; i++) {
                            if (constraints.isString(result[i]))
                                results.push(fieldErrorFromString(result[i]))
                            else
                                results.push(result[i])
                        }
                        return results
                    }
                })

            }
        }
        this.addConstraint(new ConstraintClass())
        return this
    }

    this.setValue = function(value) {
        this._value = value
    }

    this.getValue = function() {
        return this._value
    }
}

var FieldChainCall = function(validatorProxy) {
    this.validatorProxy = validatorProxy

    this.field = function(name) {
        var field = this.validatorProxy.field(name)

        return field
    }

    this.new = function() {
        return this.validatorProxy.new()
    }

    this.label = function(label) {
        this.setLabel(label)
        return this
    }

    this.example = function(example) {
        this.setExample(example)
        return this
    }

    this.description = function(description) {
        this.setDescription(description)
        return this
    }

    this.placeholder = function(placeholder) {
        this.setPlaceholder(placeholder)
        return this
    }

    this.value = function(value) {
        this.setValue(value)
        return this
    }
}

var FieldDefinition = function(name, validatorProxy) {
    FieldChainCall.call(this, validatorProxy)
    FieldBase.call(this, name)

    this.constraintFactory = new ConstraintFactory()

    this.addConstraintFactoryMethod = function(constraintClass) {
        if (constraintClass == null)
            return

        if (!this[constraintClass.constraintName]) {
            var constraintInstance = null
            this[constraintClass.constraintName] = function() {
                var args = []
                for (argument in arguments)
                    args.push(arguments[argument])

                constraintInstance = this.constraintFactory.create(constraintClass,
                    args)
                this.constraints.push(constraintInstance)

                // console.log("Field " + this.getName() + " add constraint " + constraintInstance.constructor.constraintName)

                return this
            }
        }
    }
}

function Field(name) {
    this.errors = []
    this.value = ""

    FieldBase.call(this, name)

    this.setLabel = function(label) {
        this._label = label
        this.label = label
    }

    this.setDescription = function(description) {
        this._description = description
        this.description = description
    }

    this.setPlaceholder = function(placeholder) {
        this.placeholder = this._placeholder = placeholder
    }

    this.setExample = function(example) {
        this.example = this._example = example
    }

    this.setValue = function(value) {
        this.value = value
    }

    this.valid = function() {
        return !this.hasErrors()
    }

    this.hasErrors = function() {
        return 0 < this.errors.length
    }

    this.validate = function(data) {
        var fieldSelf = this
        this.errors = []

        var fieldName = this.getName(),
            fieldLabel = this.getLabel()

        var constraints = []
        this.constraints.forEach(function(constraint) {
            var errors = constraint.validate(fieldName, fieldLabel, data)
            constraints.push(returnPromise(errors))
        })


        return Promise.all(constraints)
            .then(function(constraints) {
                constraints.forEach(function(errors) {
                    if (!errors)
                        return

                    for (var i = 0, size = errors.length; i < size; i++) {
                        var error = errors[i]
                        fieldSelf.errors.push(error)
                    }
                })
                return fieldSelf.errors
            })
    }
}

// 目的是把参数传递给Constraint
// 以constraint name为Field的方法，该方法新建Constraint的实例，但返回Field的实例
function FieldFactory(validatorProxy) {
    this.validatorProxy = validatorProxy
    this.constrantFactory = new ConstraintFactory()

    this.field = function(name, constraintClasses) {
        var field = new FieldDefinition(name, this.validatorProxy)
        constraintClasses.forEach(function(constraintClass) {
            field.addConstraintFactoryMethod(constraintClass)
        })
        return field
    }
}

var FieldValidateWrapper = function(result) {
    self = this
    this.result = result
    this.validate = function() {
        return new Promise(function(resolve, reject) {
            resolve(self.result)
        })
    }
}

function ValidatorBase(name) {
    this._name = name
    this._description = null
    this._example = null
    this.fields = {}

    this.getName = function() {
        return this._name
    }

    this.setName = function(name) {
        this._name = name
    }

    this.getDescription = function() {
        return this._description
    }

    this.setDescription = function(description) {
        this._description = description
    }

    this.getExample = function() {
        return this._example
    }

    this.setExample = function(example) {
        this._example = example
    }
}

function ValidatorDefinition(name) {
    ValidatorBase.call(this, name)

    this.validators = []

    v = this

    this.example = function(example) {
        this.setExample(example)
        return this
    }

    this.description = function(description) {
        this.setDescription = description
        return this
    }

    this.field = function(name) {
        var fieldFactory = new FieldFactory(new ValidatorProxy(this))

        var field = fieldFactory.field(name,
            v.validators.concat(ValidatorDefinition.validators))

        this.fields[field.getName()] = field

        return field
    }

    this.addConstraint = function(constraintClass) {
        ValidatorDefinition.validators.push(constraintClass)
        return this
    }

    this.new = function() {
        var ins = new Validator(this.getName())

        var field = null,
            fieldDefinition = null
        for (var fieldName in this.fields) {
            field = new Field(fieldName)
            fieldDefinition = this.fields[fieldName]

            field.setLabel(fieldDefinition.getLabel())
            field.setDescription(fieldDefinition.getDescription())
            field.setPlaceholder(fieldDefinition.getPlaceholder())
            field.setExample(fieldDefinition.getExample())
            var fieldDefinitionValue = fieldDefinition.getValue()
            if (fieldDefinitionValue)
                field.setValue(fieldDefinitionValue)

            field.constraints = fieldDefinition.constraints

            ins.addField(field)
        }

        return ins
    }
    return this
}

var Validator = function(name) {
    ValidatorBase.call(this, name)

    this.addField = function(field) {
        this.fields[field.getName()] = field
        this[field.getName()] = field
    }

    this.hasErrors = function() {
        for (var fieldName in this.fields) {
            var field = this.fields[fieldName]
            if (field.hasErrors())
                return true
        }
        return false
    }

    this.valid = function() {
        return !this.hasErrors()
    }

    this._validate = function(data) {
        var promises = []
        var field = null
        for (var fieldName in this.fields) {
            field = this.fields[fieldName]
            field.value = data[fieldName] || ""
            var promise = field.validate(data)
            promises.push(promise)
        }

        return Promise.all(promises).then(function(_) {
            return this
        })
    }

    this.validate = function(data) {
        self = this
        return new Promise(function(resolve, reject) {
            self._validate(data).then(function(_) {
                resolve()
            })
        })
    }
}

ValidatorDefinition.validators = []
validatorsDictionary = {}


function validator(name) {
    // return new ValidatorDefinition(name)
    if (validatorsDictionary.hasOwnProperty(name))
        return validatorsDictionary[name]
    else {
        var instance = new ValidatorDefinition(name)
        validatorsDictionary[name] = instance
        return instance
    }
}

function ConfigValidators() {

    // All constraints
    var globalValidators = []
    for (var key in constraints) {
        var value = constraints[key]
        if (/\w+Constraint/.test(key)) {
            globalValidators.push(value)
        }
    }

    globalValidators.forEach(function(validatorClass) {
        ValidatorDefinition.validators.push(validatorClass)
    })
}
ConfigValidators()

module.exports.FieldDefinition = FieldDefinition
module.exports.Field = Field
module.exports.FieldFactory = FieldFactory
module.exports.validator = validator
module.exports.ValidatorDefinition = ValidatorDefinition
module.exports.ConfigValidators = ConfigValidators
