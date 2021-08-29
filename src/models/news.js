const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    newsimage:{
            type:Buffer
    
        }
})

const News = mongoose.model('News',newsSchema)
module.exports = News