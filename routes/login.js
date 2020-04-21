const express = require('express')
// The Router object from express handles all routing tasks
const router = express.Router()
// Import the passport library
const passport = require('passport')
// Import the user schema so we can interact with our data base
// const UserSchema = require('../models/User')

// Instead of passing our own function callback as usual '(req, res, next) =>..'
// we let passport handle the request by calling the authenticate() function from
// passport and telling it which authentication strategy we wanna use; we only have 
// 1: localLogin defined in auth.js
// When a user fills the log in form and submits, that will send the info to this
// file and this route handler (as specified in our server.js), which then passes that info
// and control to the passport.authenticate strategy called localLocagin (in auth.js)
// and once the strategy is run then controlc comes back here and redirects to
// '/account' which then displays some info depending on if the user was successfuly
// logged in or not
router.post('/', passport.authenticate('localLogin', {
    // One of the available options to use 
    successRedirect: '/account'
}))

// router.post('/', (req, res, next) => {
//     const submittedEmail = req.body.email

    // Query our data base to find the entry with email == submittedEmail
    // users is what our db returns (users with that email); returns an array
    // bc the users with that email might be > 1 (array of 0 or more users)
    // UserSchema.find({email: submittedEmail}, (err, users) => {
    //     if (err) {
    //         // next() calls the next handler in our server.js after this one(login.js)
    //         // since the next handler is our error handler that renders the error.hjs,
    //         // then any time we use next(err), we will call that error handler routine
    //         // with argument err
    //         return next(err)
    //     }

    //     // If the array returned is empty, then there's no user with such email
    //     if (users.length == 0) {
    //         // new Error(message) returns:
    //         // Error: message
    //         return next(new Error('User Not Found'))
    //     }

    //     // Instead of getting the first element from an returned array that might
    //     // be > 1, we can just use: UserSchema.findOne(...) which returns the first
    //     // entry with the given filter

    //     // If we get to this point then there are users with that email but there might
    //     // be > 1; we just want the first one
    //     const user = users[0]

    //     // Check that the user's password (returned from our db) is the same as the one
    //     // submitted through the form
    //     if (user.password != req.body.password) {

    //         return next(new Error('Incorrect Passwor'))
    //     }

    //     res.json({
    //         confirmation: 'success',
    //         user: user
    //     })
    // })

    //     res.json({
    //         confirmation: 'success',
    //         user: users
    //     })

    // Same as above but using findOne(...) which returns only one user
    // (first entry with filter in db)
    // UserSchema.findOne({email: submittedEmail}, (err, user) => {
    //     // Error from db
    //     if (err)
    //         return next(err)

    //     // User not found
    //     if (user == null)
    //         return next(new Error('User Not Found')) 

    //     // Incorrect passwrod
    //     if (user.password != req.body.password)
    //         return next (new Error('Incorrect Password'))

    //     res.json({
    //         confirmation: 'succes',
    //         user: user
    //     })
    // })

    // Another way of doing the same logic as above
    // With promises, the arguments are not specified (in this case: users, err)
    // However they are returned just like in the normal function call (above)
    // UserSchema.find({email: submittedEmail})
    // .then(users => {
    //     res.json({
    //         confirmation: 'success',
    //         user: users
    //     })
    // })
    // .catch(err => {
    //     res.json({
    //         confirmation: 'fail',
    //         error: err
    //     })
    // })
// })

module.exports = router