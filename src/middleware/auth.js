const jwt = require('jsonwebtoken')
const Reporters = require('../models/reporters')
const auth = async (req,res,next) =>{
    // console.log('Auth Middleware')

    try{

        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)

        // Extract id from token 
        const decode = jwt.verify(token,'node-course')
        console.log(decode)

        const reporter = await Reporters.findOne({_id:decode._id,'tokens.token':token})

        if(!reporter){
            console.log('No reporter is found')
            throw new Error()
        }
        req.reporter = reporter
        console.log(req.reporter)


        // logout
        req.token = token
        next()
    }
    catch(e){
        console.log(e)
        res.status(401).send({error:'Please authenticate'})
    }

  
}

module.exports = auth