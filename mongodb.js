const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient      //initialize connection
const connectionUrl='mongodb://127.0.0.1:27017'  //define connection url
const dbName='newsData'                          //define db name
mongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Error Has been Occured')
    }
    console.log('success')
    const db=client.db(dbName)
    // db.collection('reporters').insertOne(
    //     {name:'Ali' ,Age:23}
    // )
    db.collection('reporters').insertMany([
        {name:'Ali' ,Age:23},
        {name:'nour' ,Age:23},
        {name:'noha' ,Age:25},
        {name:'Ahmed' ,Age:28}
    ]
        
    )
})