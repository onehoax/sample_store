const express = require('express')
const passport = require('passport')
// Import the user schema so we can interact with our data base
// const UserSchema = require('../models/User')
const router = express.Router()

// By using passport to authenticate registration as well, any time a new user
// registers they are logged in and a new session is started, just as when they 
// log in; this behaviour is expected when a user signs up for a service (ex:
// when a user first registers into facebook, they are logged into their account
// right after they've created their account)
router.post('/', passport.authenticate('localRegister', {
    successRedirect: '/account'
}))

// // router.post('/', (req, res, next) => {
// //     // this handles a post request and therefore we are getting information from the
// //     // request; that info is in req.body, but it is not parsed in json by default,
// //     // we have to tell our app to do so in our server.js
// //     const submittedInfo = req.body

// //     // res.json({
// //     //     data: submittedInfo
// //     // })

// //     // This creates a new user object (as specified by the schema) with the
// //     // submitted info from the form and inserts it into our database; the arg
// //     // entry is the actual user entry inserted into the data base, which is returned
// //     // back to us by the db after insertion
// //     UserSchema.create(submittedInfo)
// //     .then(entry => {
// //         res.json({
// //             confirmation: 'sucess',
// //             user: entry
// //         })
// //     })
// //     .catch(err => {
// //         res.json({
// //             confirmation: 'fail',
// //             error: err
// //         })
// //     })

//     // This is another way of doing the same logic as above
// //     UserSchema.create(submittedInfo, (err, entry) => {
// //         if (err) {
// //             res.json({
// //                 confirmation: 'fail',
// //                 error: err
// //             })

// //             return
// //         }

// //         res.json({
// //             confirmation: 'success',
// //             user: entry
// //         })
// //     })
// })

module.exports = router