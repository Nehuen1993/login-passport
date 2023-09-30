const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    isAdmin: {
        type: Boolean,
        
      },

    first_name: {
        type: String,
   
    },
    last_name: {
        type: String,
      
    },
    email: {
        type: String,

    },
    age: {
        type: Number,
      
    },
    password: {
        type: String,
        
    }
})
const User = mongoose.model('users', userSchema)

module.exports = User
