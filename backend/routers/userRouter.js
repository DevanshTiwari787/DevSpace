let express = require('express')
let app = express()
let router = express.Router();
let bcrypt = require('bcrypt')
let userModel = require("../models/user");
let jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authMiddleware');
app.use(express.json())

//get all users
router.get("/", async (req, res) => {
    let users = await userModel.find();
    if (users.length == 0) {
        res.json({
            message: "No users found yet"
        })
    }
    if (users) {
        res.status(200).json({
            message: "Users retrieved successfully!",
            users: users
        })
    }
})

//register
router.post("/register", async (req, res) => {
    try {
        let { firstName, lastName, email, password, branch, year } = req.body;
        if (!firstName || !lastName || !email || !password || !branch || !year) {
            res.status(400).json({
                message: "Please enter all the information"
            })
        }

        let decodedUser = await userModel.findOne({email});
        if(decodedUser){
            res.status(400).json({
                message : "The user already exists!"
            })
        }

        let user = await userModel.create({
            firstName,
            lastName,
            email,
            branch,
            year,
            password: await bcrypt.hash(password, 5)
        })

        res.json({
            message: "User registered successfully",
            userId : user._id
        })
    }
    catch (err) {
        res.status(500).json({
            error : err
        })
    }
})


//login
router.post("/login" , async (req,res)=>{
    try{
        let {email, password} = req.body
        if(!email || !password){
            res.status(400).json({
                message : "Enter all the fields correctly"
            })
        }

        let decodedUser = await userModel.findOne({email});
        if(!decodedUser){
            res.status(400).json({
                message : "User is not registered"
            })
        }

        let isMatch = await bcrypt.compare(password, decodedUser.password);
        if(!isMatch){
            res.status(400).json({
                message : "Incorrect password"
            })
        }

        let token = await jwt.sign({userId: decodedUser._id} , process.env.JWT_SECRET , {expiresIn: '7d'})
        res.status(200).json({
            message : "Logged In successfully",
            token : token
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})


router.get("/test", authenticate, (req,res)=>{
    console.log("this will only run after i pass the token in headers")
    res.json({
        message : "authentication endpoint worked",
        userId : req.userId
    })
})



module.exports = router
