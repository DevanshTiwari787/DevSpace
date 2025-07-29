let mongoose = require('mongoose')
require('dotenv').config()


let dbConnect = async()=> {
    try{
        await mongoose.connect(process.env.MONGO_URL)
    }
    catch(err){
        console.log("Error connecting to db: " + err)
    }
}

let db = mongoose.connection;
dbConnect();
db.on('connected' , ()=>{
    console.log("DB is connected")
})

db.on('disconnected' , ()=>{
    console.log("DB is disconnected")
})

db.on('error' , (err)=>{
    console.log("DB is facing some error: " + err)
})

module.exports = db;

