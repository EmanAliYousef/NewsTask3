const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const reportersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true      
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value < 0){
                throw new Error ('Age must be positive number')
            }
        }
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String, 
        required:true,
        trim:true,
        minLength:6
    },

    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    ,
    reporterImage:{
        type:Buffer

    }
})
//////////////////////////////////////////////////////////////////////////////////////
//hashingPassword
reportersSchema.pre('save',async function(next){
    // this document 
    const reporter = this
    if(reporter.isModified('password')){
        reporter.password = await bcrypt.hash(reporter.password,8)
    }
    next()
})
/////////////////////////////////////
// Relation
reportersSchema.virtual('news',{
    ref:'News',    // Name of model which i am making relation with
    localField:'_id',
    foreignField:'reporter'
})
/////////////////////////////////////
reportersSchema.statics.findByCredentials = async(email,password) =>{
    const reporter = await Reporters.findOne({email})
    console.log(reporter)

    if(!reporter){
        throw new Error('Unable to login. Please check email or password')
    }

    const isMatch = await bcrypt.compare(password,reporter.password)

    if(!isMatch){
        throw new Error('Unable to login. Please check email or password')
    }

    return reporter
}
/////////
reportersSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'node-course',{expiresIn:'7 days'})

    // last step
    reporter.tokens = reporter.tokens.concat({token:token})
    await reporter.save()

    return token
}
/////

//////////////////////////////////////////////////////////////////////////////////////

const Reporters = mongoose.model('Reporters',reportersSchema)
module.exports = Reporters
