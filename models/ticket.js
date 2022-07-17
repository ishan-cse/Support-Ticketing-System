const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({   
    user_uid: {
        // unique: true,
        required: true,
        type: String
    },
    issue: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String,
        default: 'Pending'
    },    
    assigned_it_staff_id: {
        required: false,
        type: String
    },
    creation_date: {
        required: true,
        type: Date, 
    },
    updating_date: {
        required: false,
        type: Date, 
    }
})

const ticketModelSchema = mongoose.model('ticket', ticketSchema);

module.exports = ticketModelSchema;