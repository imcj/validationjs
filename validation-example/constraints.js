var models = require('./models'),
    FieldError = require("../lib/result").FieldError

var UniqueUsernameConstraint = function(message) {
    this.validate = function(fieldName, fieldLabel, data) {
        var value = data[fieldName]
        return new Promise(function(resolve, reject) {
            var errors = []
            models.User.findOne({username: value}).then(function(user) {
                if (user != null)
                    errors.push(new FieldError(fieldName, fieldLabel,
                        'uniqueUsernameConstraint', '用户名已经存在'))
                resolve(errors)
            })
        })
    }
}
UniqueUsernameConstraint.constraintName = "uniqueUserName"
module.exports.UniqueUsernameConstraint = UniqueUsernameConstraint
