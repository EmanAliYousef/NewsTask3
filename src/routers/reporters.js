
const express = require('express')
const router = new express.Router()
const multer=require('multer')

const Reporters = require('../models/reporters')
const auth = require('../middleware/auth')

// SignUp

router.post('/reporters', async (req, res) => {
    console.log(req.body)
    const reporter = new Reporters(req.body)
    try{
       await reporter.save()
       const token = await reporter.generateToken()
       res.status(200).send({reporter,token})
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
 
})


////////////////////////////////////
// Login
router.post('/reporters/login',async(req,res)=>{
    try{
        const reporter = await Reporters.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter,token})
        
    }
    catch(e){
        res.send('Try again ' + e)
    }
})
////////////////////////////////////
// get all
// new request --> do sth (check token)  --> run route hanlder
router.get('/reporters',auth, (req, res) => {
    Reporters.find({}).then((reporters) => {
        res.status(200).send(reporters)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// get by id 
// params --> parameters in url (id)
router.get('/reporters/:id',auth,(req, res) => {
    console.log(req.params.id)

    const _id = req.params.id
    Reporters.findById(_id).then((reporters) => {
        if (!reporters) {
            return res.status(404).send('Unable to find user')
        }
        res.status(200).send(reporters)
    }).catch((e) => {
        res.status(500).send('Unable to connect to data base' + e)
    })
})
//get profile
router.get('/profile',auth,(req,res)=>{
    res.send(req.reporter)
})

// Update
router.patch("/reporters/:id",auth,async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const _id = req.params.id;
    try {
       
        const reporter = await Reporters.findById(_id)
        if (!reporter) {
            return res.send("No Reporter is found");
        }
        updates.forEach((update) => reporter[update] = req.body[update])
        await reporter.save();

        res.status(200).send(reporter);
    } catch (e) {
        res.status(400).send('Error' + e);
    }
});

////
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
      
            return el.token !== req.token
        })
        await req.reporter.save()
        res.send('Logout Successfully')
    }
    catch(e){
        res.send(e)
    }
})
//////
router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        await req.reporter.save()
        res.send('Logout all was done succesfully')
    }
    catch(e){
        res.send(e)
    }
})
/////
// Delete 
router.delete('/reporters/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        const reporter = await Reporters.findByIdAndDelete(_id)
        if (!reporter) {
            return res.send('No user is found')
        }
        res.send(reporter)
    }
    catch (e) {
        res.send(e)
    }
})

////
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
 router.post('reporterImage/:id',auth,upload.single('image'),async(req,res)=>{
     const _id=req.params.id
  try{
    const Task = await Task.findOne({_id,reporter:req.reporter._id})
      if(!reporter){
          return res.status(400).send('no reporter is found')
      }
      reporter.image=req.file.buffer
      task.save()
      res.send('saved')
     }
     catch(e){
         res.send(e)
     }
 })







module.exports = router