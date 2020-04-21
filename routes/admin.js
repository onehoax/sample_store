const express = require('express')

// Import the Item schema
const Item = require('../models/Item')

const router = express.Router()

// Route handler for 'localhost:5000/admin'
router.get('/', (req, res, next) => {
    // If the user is logged in, passport binds the user information to the 
    // request property
    const user = req.user;
    // If the user tries to acces the account page without being logged in then
    // this will bounce him back to the home page
    if (user == null) {
        res.redirect('/')
        return
    }

    // If the user is not an admin user, then also redirect to homepage
    if (user.isAdmin == false) {
        res.redirect('/')
        return
    }

    // Find all the items for sale, returned array by db is 'items'
    Item.find(null, (err, items) => {
        if (err)
            return next(err)

        // If we get to this point then the user is logged in and is an admin user
        const data = {
            // data contains the current user and his items
            user: user,
            items: items
        }

        // Pass the user and items for sale to the admin.hjs template
        res.render('admin', data)
    })
})

// Route handler for 'localhost:5000/admin/additem'; this is only available for 
// admin users to add items for sale
router.post('/additem', (req, res, next) => {
    // Same checks as above bc we require the user to be admin in order to the post
    const user = req.user;
    if (user == null) {
        res.redirect('/')
        return
    }

    // If the user is not an admin user, then also redirect to homepage
    if (user.isAdmin == false) {
        res.redirect('/')
        return
    }

    // If we get to this point then the user is logged in and is an admin user
    // therefore we can create the item; req.body contains the request body (form info)
    Item.create(req.body, (err, item) => {
        if (err)
            return next(err)

        // Once we create the item then redirect to '/admin' so that admin can 
        // continue adding items if needed
        res.redirect('/admin')

        // res.json({
        //     confirmation: 'success',
        //     // We will see the json of the item if it in fact is created in the db;
        //     // the db returns item if it was successfuly created in it
        //     item: item
        // })
    })
})

module.exports = router