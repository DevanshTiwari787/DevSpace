let jwt = require('jsonwebtoken')

let authenticate = async (req,res,next)=>{
    try{
        let token = req.headers.token;
        if(!token){
            res.status(400).json({
                message : "Authentication failed"
            })
        }

        let user = await jwt.verify(token, process.env.JWT_SECRET) //if this will be verified, it will return the userId
        if(!user){
            res.status(400).json({
                message : "Authentication failed"
            })
        }
        else{
            req.userId  = user.userId
            next()
        }

    }
    catch(err){
        console.log(err)
        res.status(404).json({
            message : "Authentication failed"
        })
    }
}

module.exports = authenticate