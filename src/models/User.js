const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    isAdmin: {
        type: Boolean,
        default: false
      },

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const User = mongoose.model('users', userSchema)

module.exports = User