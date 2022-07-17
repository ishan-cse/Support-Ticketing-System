const express = require('express');
const Auth = require("../middlewares/authorize");
const Admin = require("../middlewares/admin");
const itStaff = require("../middlewares/it-staff");
const forbidden = require("../middlewares/forbidden");
const router = express.Router();
const Ticket = require('../models/ticket');
const User = require('../models/user');
const nodemailer = require('nodemailer');

/**
 * Get all tickets for specific user by UUID
 * @route 
 * @description
 * @returns {object} Tickets
 * @example GET /tickets/user/62d30853b769b49d2a86c682
 * // return {
 * "_id": "62d30853b769b49d2a86c684",
 * "user_uid": "62d30853b769b49d2a86c682",
 * "issue": "32432zzaazazzx",
 * "status": "Pending",
 * "creation_date": "2022-07-16T18:49:55.484Z",
 * "__v": 0
 * }
 */
router.get("/tickets/user/:uuid", async (req, res) => {
    try{
        const {uuid} = req.params;
        console.log(uuid);
        const allTickets = await Ticket.find({user_uid:uuid});
        if(allTickets){
            res.status(200).send(allTickets);
        }else{
            res.status(401).send("Invalid");
        }
    }catch(error){
        res.send(error);
    }
});

/**
 * Get all tickets for Admin or specific IT Staff
 * @route 
 * @description
 * @returns {object} Tickets
 * @example GET /tickets
 * // return {
 * "_id": "62d3d32ee1b96f25d7d15ba4",
 * "user_uid": "62d3d0b22c02c0c248ce5ce9",
 * "issue": "Ups not working properly.",
 * "status": "Approved",
 * "creation_date": "2022-07-17T09:15:26.257Z",
 * "__v": 0,
 * "assigned_it_staff_id": "62d3cc144427cede223928ba",
 * "updating_date": "2022-07-17T09:40:11.032Z"
 * }
 */
 router.get("/tickets", Auth, async (req, res) => {
    const {_id,role} = req.user;
    if(role === "admin"){
        try{
            const allTickets = await Ticket.find({});
            if(allTickets){
                res.send(allTickets);
            }else{
                res.status(200).send("Invalid!");
            }
        }catch(error){
            res.send(error);
        }
    }else if(role === "IT Staff"){
        try{
            const allTickets = await Ticket.find({assigned_it_staff_id:_id});
            if(allTickets){
                res.send(allTickets);
            }else{
                res.status(200).send("Invalid!");
            }
        }catch(error){
            res.send(error);
        }
    }else{
        forbidden();
    }

});

/**
 * Create new ticket by user
 * @route 
 * @description
 * @body {object} ticket - ticket object for create new ticket
 * @returns {object} ticket - Created ticket object
 * @example POST /ticket
 * // return {
 * "user_uid": "62d3d0b22c02c0c248ce5ce9",
 * "issue": "Net not working properly.",
 * "status": "Pending",
 * "creation_date": "2022-07-17T09:16:17.358Z",
 * "_id": "62d3d361e1b96f25d7d15ba7",
 * "__v": 0
 * }
 */
router.post('/ticket', async (req, res) => {
    const {email, issue} = req.body;
    
    try{
        const user = await User.findOne({email:email});
        if(user){
            const {_id,email} = user;
            const data = new Ticket({
                user_uid: _id,
                issue: issue,
                status: "Pending",
                creation_date: new Date()
            })
        
            try {
                const dataToSave = await data.save();
                res.status(201).send(dataToSave);
                try {
                    const transporter = nodemailer.createTransport({
                        // service: 'gmail',
                        // auth: {
                        //   user: '814a5abe39-5e913b@inbox.mailtrap.io',
                        //   pass: 'bnvn@Bn&5#'
                        // }
                        host: "smtp.mailtrap.io",
                        port: 2525,
                        auth: {
                          user: "bd92157cffe16f",
                          pass: "081ef9f8b00081"
                        }
                      });
                      
                      const mailOptions = {
                        from: '814a5abe39-5e913b@inbox.mailtrap.io',
                        to: email,
                        subject: 'Support Ticket Generated Successfully',
                        text: `Your support ticket generated successfully.
                        Go to : https://wwww.sts.com/tickets/user/${_id}
                        Your UUID : ${_id}`        
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          res.send('Email sent: ' + info.response);
                        }
                      });                    
                }catch (error){
                    res.send(error);
                }
            }catch (error) {
                res.send(error);
            }
        }else{
            const userData = new User({
                name: 'User',
                email: email,
                password: '12345',
                role: 'User'
            }) 
            try {
                const userDataToSave = await userData.save();
                const {_id} = userDataToSave;
            console.log(_id);
                const data = new Ticket({
                    user_uid: _id,
                    issue: issue,
                    status: "Pending",
                    creation_date: new Date()
                })
            
                try {
                    const dataToSave = await data.save();
                    res.status(201).send(dataToSave);
                    try {
                        const transporter = nodemailer.createTransport({
                            // service: 'gmail',
                            // auth: {
                            //   user: '814a5abe39-5e913b@inbox.mailtrap.io',
                            //   pass: 'bnvn@Bn&5#'
                            // }
                            host: "smtp.mailtrap.io",
                            port: 2525,
                            auth: {
                              user: "bd92157cffe16f",
                              pass: "081ef9f8b00081"
                            }
                          });
                          
                          const mailOptions = {
                            from: '814a5abe39-5e913b@inbox.mailtrap.io',
                            to: email,
                            subject: 'Support Ticket Generated Successfully',
                            text: `Your support ticket generated successfully.
                            Go to : https://wwww.sts.com/tickets/user/${_id}
                            Your UUID : ${_id}`        
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              res.send('Email sent: ' + info.response);
                            }
                          });                    
                    }catch (error){
                        res.send(error);
                    }
                }catch (error) {
                    res.send(error);
                }
            }catch (err){
                res.send(err);
            }       
            //res.status(200).send("Invalid!");
        }
    }catch(error){
        res.send(error);
    }

})

/**
 * Assign ticket to IT Staff by Admin
 * @route 
 * @description
 * @param {string} ticketId - Object ID of the ticket
 * @returns {object} Ticket
 * @example PUT /ticket/assign/62d3d32ee1b96f25d7d15ba4
 * // return {
 * "_id": "62d3d32ee1b96f25d7d15ba4",
 * "user_uid": "62d3d0b22c02c0c248ce5ce9",
 * "issue": "Ups not working properly.",
 * "status": "Approved",
 * "creation_date": "2022-07-17T09:15:26.257Z",
 * "__v": 0,
 * "assigned_it_staff_id": "62d3cc144427cede223928ba",
 * "updating_date": "2022-07-17T09:40:11.032Z"
 * }
 */
router.put('/ticket/assign/:ticketId', Auth, Admin, async (req, res) => {
    const {assigned_it_staff_id} = req.body;
    const {ticketId} = req.params;

    try {
        console.log(ticketId);
        await Ticket.updateOne({_id:ticketId}, {
            "assigned_it_staff_id" : assigned_it_staff_id,
            "status" : "Approved",
            "updating_date" : new Date()
        });

        try{
            const updatedData = await Ticket.findOne({_id:ticketId});
            if(updatedData){
                res.status(200).send(updatedData);
            }else{
                res.send("You are not authorized user!");
            }
        }catch(err){
            res.send(err);
        }
    }catch (error) {
        res.send(error);
    }
})

/**
 * Close assigned ticket by authorized IT Staff
 * @route 
 * @description
 * @param {string} ticketId - Object ID of the ticket
 * @returns {object} Ticket
 * @example PUT /ticket/close/62d3d32ee1b96f25d7d15ba4
 * // return {
 * "_id": "62d3d32ee1b96f25d7d15ba4",
 * "user_uid": "62d3d0b22c02c0c248ce5ce9",
 * "issue": "Ups not working properly.",
 * "status": "Close",
 * "creation_date": "2022-07-17T09:15:26.257Z",
 * "__v": 0,
 * "assigned_it_staff_id": "62d3cc144427cede223928ba",
 * "updating_date": "2022-07-17T09:57:16.846Z"
 * }
 */
 router.put('/ticket/close/:ticketId', Auth, itStaff, async (req, res) => {
    const {ticketId} = req.params;
    const {_id} = req.user;

    try {
        console.log(ticketId, _id);
        await Ticket.updateOne({_id:ticketId, assigned_it_staff_id:_id}, {
            "status" : "Close",
            "updating_date" : new Date()
        });

        try{
            const updatedData = await Ticket.findOne({_id:ticketId, assigned_it_staff_id:_id});
            if(updatedData){
                res.status(200).send(updatedData);
            }else{
                res.send("You are not authorized user!");
            }
        }catch(err){
            res.send(err);
        }
    }catch (error) {
        res.send(error);
    }
})

/**
 * Delete specific ticket using ticket ID by admin
 * @route 
 * @description
 * @param {string} ticketId - Object ID of the ticket
 * @returns {string} message
 * @example DELETE /ticket/62d30b86ed5c6856d70b40f5
 * // return "Ticket deleted successfully!"
 */
router.delete('/ticket/:ticketId', Auth, Admin, async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticketDeleted = await Ticket.deleteOne({_id:ticketId});
        if(ticketDeleted){
            res.status(200).send({ Message : "Ticket deleted successfully!" });
        }else{
            res.send("You are not authorized user!");
        }
    }catch (error) {
        res.send(error);
    }
})


module.exports = router;