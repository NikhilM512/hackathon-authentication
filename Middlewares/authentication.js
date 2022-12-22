const jwt = require("jsonwebtoken")
require('dotenv').config()

const authenticate = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    if(token){
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(decodedToken)
        if(decodedToken){
            const userID = decodedToken.userID
            req.body.userID = userID
            next()
        }
        else{
            res.send("Authentication Failed, Please Login")
        }  
    }
    else{
        res.send("Authentication Failed, Please Login")
    }
}


module.exports = {authenticate}