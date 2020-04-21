const express = require('express')

// The Router object from express handles all routing tasks
const router = express.Router()

router.get('/', (req, res, next) => {
    // render tells the app to use the templating engine we defined in server.js
    // and to render the home.hjs template defined in our views folder
    // in server.js we told the app what engine to use and where to look for the 
    // the templates, therefore we don't need to specify the .hjs extension bc
    // it already knows it
    res.render('home', null)
})

module.exports = router