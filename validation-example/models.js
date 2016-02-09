var mongoose = require('mongoose'),
    crypto = require('crypto')

var UserSchema = new mongoose.Schema({
    username: { type:String, unique: true },
    hashedPassword: String
})

UserSchema.virtual("password").set(function(password) {
    this.hashedPassword = crypto
        .createHmac('sha1', '').update(password).digest('hex')
    this._password = password
})

UserSchema.virtual("password").get(function() {
    return this.password
})
module.exports.User = mongoose.model('User', UserSchema)
