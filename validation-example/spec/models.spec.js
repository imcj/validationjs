var constraints = require('../constraints')
    User = require('../models').User,
    mongoose = require('mongoose')

describe("", function() {
    beforeEach(function(done) {
        mongoose.connect('mongodb://localhost/test')
        mongoose.connection.on('open', function() {
            User.remove({username: "weicongju@gmail.com"}).then(function() {
                return User.create(
                    {username: "weicongju@gmail.com", password: "123"}
                )
            }).then(function(user) {
                done()
            })

        }).on('err', function(error) {
            console.log(error.stack)
            done()
        })
    })

    it("UniqueUsernameConstraint", function(done) {
        var unique = new constraints.UniqueUsernameConstraint()
        unique.validate("username", "Username", {"username": "weicongju@gmail.com"}).then(function(errors) {
            expect(errors.length).toEqual(1)
            done()
        }).catch(function(error) {
            console.log(error)
            done()
        })
    })
})
