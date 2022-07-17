const jwt = require('jsonwebtoken');
/**
 * @middleware 
 * @description
 * @header {string} req - JSON Web Token for valid user access
 */
const adminMiddleware = (req, res, next) => {
    const {role} = req.user;
    if(role === "IT Staff"){
        next();
    }else{
        res.status(403).send("Forbidden");
    }
}

module.exports = adminMiddleware;