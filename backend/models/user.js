let mongoose = require('mongoose')
let Schema = mongoose.Schema;
let ObjectId = mongoose.ObjectId;

let user = new Schema({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    password : {type: String, required : true},
    branch : {type: String, required: true},
    email : {type: String, required: true , unique : true},
    year : {type: String, required: true , enum : ['FE', 'SE', 'TE', 'BE']},
    linkedIn : {type: String},
    leetcode : {type: String},
    posts : [{type : ObjectId , ref : posts}],
})

let userModel = mongoose.model('users' , user);
module.exports = userModel