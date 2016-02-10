function ValidationResult() {
    this.fields = []



    this.addFieldValidationResult = function(fieldValidationResult) {
        this[fieldValidationResult.fieldName] = fieldValidationResult
        this.fields.push(fieldValidationResult)
    }
}



function FieldValidationResult(fieldName, fieldLabel, value) {
    this.fieldName = fieldName
    this.value = value
    this.errors = []

    this.addError = function(validationError) {
        this.errors.push(validationError)
    }

    this.valid = function() {
        return !this.hasErrors()
    }

    this.hasErrors = function() {
        return 0 < this.errors.length
    }
}

module.exports.FieldError = FieldError
module.exports.FieldValidationResult = FieldValidationResult
module.exports.ValidationResult = ValidationResult
