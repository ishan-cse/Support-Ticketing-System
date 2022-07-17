const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({   
    name: {
        required: true,
        type: String
    },
    email: {
        unique: ["true","This email already taken!"],
        required: ["true","Email is required!"],
        type: String
    },
    password: {
        required: true,
        type: String
    },
    role: {
        required: true,
        type: String,
        default: "IT Staff"
    }
})

const userModelSchema = mongoose.model('user', userSchema);

module.exports = userModelSchema;