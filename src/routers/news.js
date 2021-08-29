const express = require('express')
const News = require('../models/news')
const multer=require('multer')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/news',auth,async(req,res)=>{
    const news = new News({...req.body,reporter:req.reporter._id})
    console.log(req.body)
    console.log(req.reporter._id)
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

// get all

router.get('/news',auth,async(req,res)=>{
    try{
       await req.reporter.populate('news').execPopulate()
       res.send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// get by id

router.get('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        // _id --> Task id
        // owner
        const news = await News.findOne({_id,reporter:req.reporter._id})
        if(!news){
            return res.status(404).send(' not found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// patch
router.patch('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
        const news = await News.findOne({_id,reporter:req.reporter._id})
        if(!news){
            return res.status(404).send('news is not found')
        }
        updates.forEach((update)=> news[update] = req.body[update])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(400).send(e)
    }

})

// Delete
router.delete('/news/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndDelete({_id,reporter:req.reporter._id})
        if(!news){
            return res.status(404).send(' not found')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

///
//upload picture
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
      return cb(new Error('upload an image'))
    }
    cb(null , true)
    }
})
 router.post('newsImage/:id',auth,upload.single('image'),async(req,res)=>{
     const _id=req.params.id
  try{
    const Task = await Task.findOne({_id,news:req.news._id})
      if(!reporter){
          return res.status(400).send('no news is found')
      }
      news.image=req.file.buffer
      task.save()
      res.send('saved')
     }
     catch(e){
         res.send(e)
     }
 })

///
module.exports = router