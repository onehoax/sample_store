const express = require('express')
const Item = require('../models/Item')
const User = require('../models/User')
// This is a function from the mailgun-js API
const Mailgun = require('mailgun-js')
const bcrypt = require('bcryptjs')
const router = express.Router()

// Random string generator
function randomString(length) {
    var text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZAabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

// If we specify in our server.js that all route requests of the form '/account'
// be handled by this file and handler, then in this file we just specify
// '/' in our get/post requests, which means to handle any requests of the form
// '/account/...'
router.get('/', (req, res, next) => {
    // If the user is logged in, passport binds the user information to the 
    // request property
    const user = req.user
    // If the user tries to acces the account page without being logged in then
    // this will bounce him back to the home page
    if (user == null) {
        res.redirect('/')
        return
    }

    // Find all the items for sale (passing null as arg means find all)
    Item.find(null, (err, items) => {
        if (err)
            return next(err)

        // Find the items which have the current user's _id  in their interested array
        // Even though interested is an array, you can query by individual elements in the
        // array and it will return all items which have the current user's _id in their
        // interested array as the array interestedItems
        Item.find({interested: user._id}, (err, interestedItems) => {
            if (err)
                return next(err)

            // The res.render function takes 2 args: the template that it should render 
            // (account.hjs) and a json object; this data json object is our second arg
            // which contains the user object of the user who's currently logged in ,
            // all the items for sale and all items this user is interested in
            const data = {
                user: user,
                items: items,
                interestedItems: interestedItems
            }
            
            // then we use the hjs engine to render account.hjs and pass data so that
            // the placeholder in account.hjs can be replaced by user.email and items for sale
            res.render('account', data)
        })
    })
    // // therefore if the user is logged in we will see the user info in json
    // res.json({
    //     // the logical or is for: if req.user is null, then show 'not logged in' intead
    //     user: user || 'not logged in'
    // })
})

// Route handler for '/account/additem/:itemid'; this route is requested when
// a user adds an item for sale to his item list; ':itemid' is a parameter, which
// we pass in when the user follows the hyperlink to add an item (id of item in db)
// In this case, rather than having each user have an array property to hold all items
// he is interested in, each item has an array property (interested) that holds all users
// interested in the item
router.get('/additem/:itemid', (req, res, next) => {
    const user = req.user
    // If the user tries to acces the account page without being logged in then
    // this will bounce him back to the home page
    if (user == null) {
        res.redirect('/')
        return
    }

    // Find the item in db with the id passed in through the request, (req.params.id)
    Item.findById(req.params.itemid, (err, item) => {
        if (err)
            return next(err)
        
        // We wamt to add the current user's id (provided by db) to the current item's
        // (item we just found) interested array; '_id' is the name of the property given by db 
        // Check if user is not already in this items interested list; indexOf(element) returns -1
        // if element doesn't exist in the array 'interested'
        if (item.interested.indexOf(user._id) == -1)  {
            item.interested.push(user._id)
            item.save()
            // Redirect to account page once item is added
            res.redirect('/account')
            // res.json({
            //     item: item
            // })
        } else {
            return next(new Error('This item was already added'))
        }
    })
})

// Route handler for '/account/removeitem/:itemid'; this route is requested when
// a user removes an item from his list of interested items
router.get('/removeitem/:itemid', (req, res, next) => {
    const user = req.user
    // If the user is not logged in then redirect to homepage
    if (user == null) {
        res.redirect('/')
        return
    } 

    // If user is logged in then remove item from his interested list;
    // (remove the current user from the item's interested array)
    Item.findById(req.params.itemid, (err, item) => {
        if (err)
            return next(err)

        // Sisnce the remove button from the current user's interested list is
        // what led to this route then we are sure the item is in the user's interested
        // list and there's no need to check whether it exists in the list or not
        // Get the index of the current user's id in the interested array
        const index = item.interested.indexOf(user._id)
        // Then use the splice method to remove the user id from the array;
        // splice(index, #) means to remove from index 'index' and remove # elements
        item.interested.splice(index, 1)
        item.save()
        // Then redirect to '/account' after removal
        res.redirect('/account')
    })
})

// By the above comments, this route handler then handles all requests of the 
// form '/account/logout/...'
router.get('/logout', (req, res, next) => {
    // logout() is a function that passport binds to the request 
    // object which clear the session (destroy the current session)
    req.logOut()
    // redirect user to home page when they logout
    res.redirect('/')
    // res.json({
    //     confirmation: 'user logged out'
    // })
})

// Route handler for sending email to reseting password; '/account/resetpassword'
router.post('/resetpassword', (req, res, next) => {
    // First find the user
    User.findOne({email: req.body.email}, (err, user) => {
        if (err)
            return next(err)

        user.nonce = randomString(8)
        user.passwordResetTime = new Date()
        user.save()

        // Info provided in mailgun account
        const mailgun = Mailgun({
            apiKey: 'dba3cf5ce63e713dd4c4c20f460a453a-aa4b0867-be8e2f72',
            domain: 'sandboxa77589de5d0f40f58a7c0338e1d87743.mailgun.org'
        })

        // to = email to send reset password email to
        // from = email attached to the mailgun account
        const data = {
            to: req.body.email,
            from: 'andres150291@gmail.com',
            // sender = name in the email sent
            sender: 'Sample Store',
            subject: 'Password Reset Request',
            // This is the content of the email
            html: 'Please click <a style="color:red" href="http://localhost:5000/account/password-reset?nonce='+user.nonce+'&id='+user._id+'">HERE</a> to reset your password. This link is valdid for 24 hrs'
        }

        // mailgun lets us acces the mailgun sdk
        mailgun.messages().send(data, (err, body) => {
            if (err)
                return next(err)

            // Success
            res.json({
                confirmation: 'success',
                data: 'reset password endpoint',
                user: user
            })
        })
    })
})

// Route handler for reseting password; '/account/password-reset';
// this route is called when user clicks on email sent to reset passwor;
// the link in the email contains the user nonce and id
router.get('/password-reset', (req, res, next) => {
    // Grab the nonce and the user id from the request; if any of these 2
    // args is null then we throw an error
    const nonce = req.query.nonce
    const user_id = req.query.id

    if (nonce == null || user_id == null)
        return next(new Error('Invalid Request'))

    // Find the user requesting the password reset in the db
    User.findById(user_id, (err, user) => {
        if (err)
            return next(new Error('Invalid Request'))
        
        // If either the passwordResetTime or nonce fields of the user are null
        // this means the current user did not request a password reset and this 
        // procedure shouldn't be happening
        if (user.passwordResetTime == null || user.nonce == null)
            return next(new Error('Invalid Request'))

        // Check that the nonce in the request is the same as the user's nonce
        if (nonce != user.nonce)
            return next(new Error('Invalid Request'))

        // Since there's a window of 24hrs to reset the password, we need to compare 
        // the time the password reset was requested with the current time
        const now = new Date()
        // Time in miliseconds
        const diff = now - user.passwordResetTime 
        // convert to mins
        const mins = (diff / 1000) / 60 

        // If mins > than mins in 24 hrs, then the link to reset password has expired
        if (mins > (24 * 60))
            return next(new Error('Invalid Request'))

        // Pass this instead of the whole user to avoid passing uncessessary 
        // (and possibly sensitive info to the template)
        const data = {
            id: user_id,
            nonce: nonce
        }

        // Render the ../views/password_reset.hjs template and pass in the user
        res.render('password_reset', data)
    })
})

// Route handler for new password; '/account/new_password';
// this route is requested when the user clicks on 'Reset Password' button
// on page from email 
router.post('/new_password', (req, res, next) => {
    // Grab the form (request) info
    const password1 = req.body.password1
    const password2 = req.body.password2
    const user_id = req.body.id
    const nonce = req.body.nonce

    // If any of the fields in the form are null then error
    if (password1 == "" || password2 == "" || user_id == null || nonce == null)
        return next(new Error('Invalid Request'))

    // If passwords are no the same then error
    if (password1 != password2)
        return next(new Error('Passwords do not match'))

    // Recheck that the user.nonce == the nonce in request and that the
    // reset password time has not expired
    User.findById(user_id, (err, user) => {
        if (err)
            return next(new Error('Invalid Request'))
        
        // If either the passwordResetTime or nonce fields of the user are null
        // this means the current user did not request a password reset and this 
        // procedure shouldn't be happening
        if (user.passwordResetTime == null || user.nonce == null)
            return next(new Error('Invalid Request'))

        // Check that the nonce in the request is the same as the user's nonce
        if (nonce != user.nonce)
            return next(new Error('Invalid Request'))

        // Since there's a window of 24hrs to reset the password, we need to compare 
        // the time the password reset was requested with the current time
        const now = new Date()
        // Time in miliseconds
        const diff = now - user.passwordResetTime 
        // convert to mins
        const mins = (diff / 1000) / 60 

        // If mins > than mins in 24 hrs, then the link to reset password has expired
        if (mins > (24 * 60))
            return next(new Error('Invalid Request'))

        // If we get here then all checks have passed and we can reset the password 
        // for the current user; first hash the new password provided
        const hashedPw = bcrypt.hashSync(password1, 10)
        // Make the hashed password the new user's password
        user.password = hashedPw
        // save the changes made to the current user object in the db
        user.save()

        // Finally redirect user to homepage so the can log in with new password
        res.redirect('/')
    })
})

module.exports = router