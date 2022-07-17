require('dotenv').config();
const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require('../models/user');

/**
 * User registration ( IT Staff )
 * @route 
 * @description
 * @body {object} req - user object for registration
 * @returns {string} res - json web token & registrared user object
 * @example POST /user/registration
 * // return Registration successful.
 *                   Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmQzY2MxNDQ0MjdjZWRlMjIzOTI4YmEiLCJuYW1lIjoiVGFuaXNhIiwiZW1haWwiOiJ0YW5pc2FAZ21haWwuY29tIiwicm9sZSI6IklUIFN0YWZmIiwiaWF0IjoxNjU4MDQ3NTA5fQ.KQGYvcb9OPD-cYTgoEpaAl-COoow3h0EQVy2pvS0XGM,
 *                   Your info ------------------- 
 *                   {
 * name: 'Tanisa',
 * email: 'tanisa@gmail.com',
 * password: '12345',
 * role: 'IT Staff',
 * _id: new ObjectId("62d3cc144427cede223928ba"),
 * __v: 0
 * }
 */
router.post('/user/registration', async (req, res) => {
    const {name, email, password} = req.body;
    const data = new User({
        name: name,
        email: email,
        password: password,
    })

    try{
        const existedEmail = await User.findOne({email:email});
        if(existedEmail){
            res.send("This email address already taken!");
        }else{
            try {
                const dataToSave = await data.save();
                const {name, email} = dataToSave;
                try{
                    const user = await User.findOne({email:email});
                    const { _id, role } = user;
                    const token = jwt.sign({_id:_id, name : name, email : email, role : role}, process.env.secretKey);
                    res.status(201).send(`Registration successful.
                    Token : ${token},
                    Your info ------------------- 
                    ${dataToSave}`);
                }catch(err){
                    res.send(err);
                }
            }catch (error) {
                res.send(error);
            }
        }
    }catch(err){
        res.send(err.message);
    }
})

/**
 * User login 
 * @route 
 * @description
 * @param {object} req - user object for login
 * @returns {string} res - json web token & user object
 * @example POST /user/login
 * // return Login successful.
 *           Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmQzY2I5ZmQzYTdmZTQzZGNhZDliMjUiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1ODA0NzY3OH0.c8bgCK4ALMnpPdx8vjVp-H5Q5hOHauZfJnASLdfu2l8,
 *           {
 * _id: new ObjectId("62d3cb9fd3a7fe43dcad9b25"),
 * name: 'Admin',
 * email: 'admin@gmail.com',
 * password: '12345',
 * role: 'admin',
 * __v: 0
 * }
 */
router.post('/user/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const verifyUser = await User.findOne({email, password});
        
        if(verifyUser){
            const {_id, email, name, role} = verifyUser;
            const token = jwt.sign({_id : _id, name : name, email : email, role : role}, process.env.secretKey);
            res.status(200).send(`Login successful.
            Token : ${token},
            ${verifyUser}`);
        }else{
            res.send("Your email or password did not matched!")
        }
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;