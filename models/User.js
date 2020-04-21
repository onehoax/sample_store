// Schemas's name's first letter is capitalized by convention (also the file name)
// Schemas/Models dictate how our data is organized in our data base for a 
// particular object; this is the Schema for users

const mongoose = require('mongoose')

const User = new mongoose.Schema({
    email: {type: String, default: ''},
    password: {type: String, default: ''},
    // To defferentiate admin users from customer users (admin.hjs 
    // is only accessible to admin users)
    isAdmin: {type: Boolean, default: false},
    timestamp: {type: Date, default: Date.now},
    // A nonce word (also called an occasionalism) is a lexeme created 
    // for a single occasion to solve an immediate problem of communication.  
    // nonce and date being null means the user hasn't requested any password resets
    nonce: {type: String, default: null},
    passwordResetTime: {type: Date, default: null}
})

module.exports = mongoose.model('UserSchema', User)