let mongoose = require('mongoose')
let Schema = mongoose.Schema;
let ObjectId = mongoose.ObjectId;

let post = new Schema({
    description : {type: String, required: true},
    image : {type: String},
    timeUploaded : {type: String,default : Date.now,  required: true},
    userId : {type: ObjectId, ref: 'users'},
    likes : [{type: ObjectId ,ref : 'users'}] //can return its length to find the number of users who have liked the post
})

let postModel = mongoose.model('posts' , post);
module.exports = postModel