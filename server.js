const express = require('express')
// Already builtin in with node
const path = require('path')
const mongoose = require('mongoose')
// Import required packages to deal with login sessions (so once the uer
// logs in he stays signed in until he logs out)
// When a user logs in that creates a session, which is stored in the browser in what's
// called a cookie and the session is maintained even if you navigate away from the website
// or turn off the computer or close the browser (remains logged in for an amount of time we specify)
// So the session is what makes it possibke to remian logged in and passport manipulates that session
// in our behalf; passport configures that for us depending on if the user is logged in or not
const passport = require('passport')
const session = require('express-session')
// Import the exports from auth.js, which is our strategy function (not just a
// json object as usual), therefore passs in the necessary arguments (which is
// the passport library)
// When the app initially loads, this function will be triggered and by the time
// the user tries to log in, the passport.authenticate strategy that we call in our
// login.js will be effective
const auth = require('./config/auth')(passport)

// Import routes
const homeRoute = require('./routes/home')
const registerRoute = require('./routes/register')
const loginRoute = require('./routes/login')
const accountRoute = require('./routes/account')
const adminRoute = require('./routes/admin')

const app = express()

// Session configuration; if you feel an account has been compromised, we can change the secret
// and this loggs everyone out so they have to reauthenticate to log in
app.use(session( {
    secret: 'sefwe',
    resave: true,
    saveUninitialized: true
}))

// Initialize passport
app.use(passport.initialize())
// Tell passport to use session to maintain the logged in state
app.use(passport.session())

// Connect to our app to our database
mongoose.connect('mongodb+srv://andres:123@cluster0-dogr1.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(data => {
    console.log('DB Connection Success!')
})
.catch(err => {
    console.log('DB Connection Failed! ' + err.message) 
})

/* --- Middleware needed --- */
// This one tells our app to parse our submitted form data in json
app.use(express.json())
// This one enables us to receive form data and properly parse it out into the 
// corresponding parts
app.use(express.urlencoded({extended: false}))

// Tell the app to use homeRoute for any requests starting with '/'
app.use('/', homeRoute)
// Tell the app to use the registerRoute for any requests starting with '/register'
app.use('/register', registerRoute)
// Tell the app to use the loginRoute for any requests starting with '/login'
app.use('/login', loginRoute)
// Tell our app to use the accountRoute for any requests starting with '/account'
app.use('/account', accountRoute)
// Tell our app to use the adminRoute for any requests starting with '/admin'
app.use('/admin', adminRoute)

// Tell our app to render the error.hjs template whenever an error occurs and
// pass the message to the template so that the placeholder in the template can be 
// replaced with the appropiate message
app.use((err, req, res, next) => {
    res.render('error', {message: err})
})

// Tell app to use the hjs templating engine 
app.set('view engine', 'hjs')
// Set the path where our templates reside (views): path joins
// the name of the current directory (__dirname) with views;
// result is the same as if we wrote './views'
app.set('views', path.join(__dirname, 'views'))

// Tell the app to use the './public' folder for any static asset requests
app.use(express.static(path.join(__dirname, 'public')))

app.listen(5000)
console.log('App is running on http://localhost:5000')