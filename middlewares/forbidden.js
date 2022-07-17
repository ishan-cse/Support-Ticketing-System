const jwt = require('jsonwebtoken');
/**
 * @middleware 
 * @description
 * @header {string} req - JSON Web Token for valid user access
 */
const forbidden = (req, res, next) => {
    res.status(403).send("Forbidden");
}

module.exports = forbidden;