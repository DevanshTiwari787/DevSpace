let express = require('express')
let app = express()
let router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
let postModel = require("../models/post");
let userModel = require("../models/user")
let jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authMiddleware');
app.use(express.json())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'social_media_posts', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 1080, height: 1080, crop: 'limit' }, // Optimize image size
            { quality: 'auto:good' } // Auto optimize quality
        ]
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post("/", authenticate, upload.array('images', 5), async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({
                message: "No description provided"
            });
        }

        // Process multiple images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
                originalName: file.originalname
            }));
        }

        const post = await postModel.create({
            description,
            images: images, // Array of image objects
            userId: req.userId
        });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: post
        });

    } catch (err) {
        // Cleanup uploaded files on error
        if (req.files && req.files.length > 0) {
            const cleanupPromises = req.files.map(file => 
                cloudinary.uploader.destroy(file.filename)
            );
            await Promise.allSettled(cleanupPromises);
        }

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

//route to view all the posts
router.get("/" ,authenticate, async(req,res)=>{
    try{
        let posts = await postModel.find() //fetches all the posts
        if(posts.length == 0){
            return res.json({
                message : "No posts made yet"
            })
        }
        res.json({
            message : "Here are all the posts",
            posts : posts
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})

//route to get the users post
router.get("/myPosts" ,authenticate, async(req,res)=>{
    try{
        let posts = await postModel.find({userId : req.userId}) //fetches all the posts
        if(posts.length == 0){
            return res.json({
                message : "No posts made yet"
            })
        }
        res.json({
            message : "Here are all the posts",
            posts : posts
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})


//route to make a post
router.post("/" ,authenticate, async (req,res)=>{
    try{
        let {description, image} = req.body
        if(!description){
            return res.status(404).json({
                message : "No description provided"
            })
        }
        let post = await postModel.create({
            description,
            image,
            userId : req.userId
        })

        res.json({
            message : "A post was made",
            postMade : post
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})


//route to delete a post
router.delete("/delete/:postId" ,authenticate, async (req,res)=>{
    try{
        let postId = req.params.postId;
        if(!postId){
            return res.json({
                message : "Post id not given"
            })
        }
        let post = await postModel.findByIdAndDelete(postId);
        res.status(200).json({
            message : "Post deleted!"
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})


//route to update a post
router.put("/edit/:postId" ,authenticate, async(req,res)=>{
    try{
        let postId = req.params.postId;
        let {description} = req.body
        if(!postId){
            return res.json({
                message : "PostId not provided"
            })
        }
        let post = await postModel.findByIdAndUpdate(postId , {description});
        res.json({
            message : "Post updated successfully"
        })
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})


//features to be added: 
    /*
        Like a post, retap and unlike
        Cloudinary upload send the link to mongo
        Search users
        user profile update
        Hackathon route
        Contests Route

    */

router.post("/like/:id" ,authenticate, async (req,res)=>{
    try{
        let postId = req.params.id;
        let post = await postModel.findById(postId)
        if(!post){
            res.status(404).json({
                message : "Post not found!"
            })
        }
        let updatedPost;
        let hasLiked = post.likes.includes(req.userId)

        if(hasLiked){
            //if already liked and this req is coming then the user wants to unlike the post
            updatedPost = await postModel.findByIdAndUpdate(postId, { $pull: { likes: req.userId } }, {new : true})
        }
        else{
            updatedPost = await postModel.findByIdAndUpdate(postId, {$addToSet : {likes : req.userId}} , {new : true})
        }

        res.status(200).json({
            success: true,
            message: hasLiked ? "Post unliked" : "Post liked",
            likesCount: updatedPost.likes.length,
            isLiked: !hasLiked
        });
    }
    catch(err){
        res.status(500).json({
            error : err
        })
    }
})

//upload a image: after sending the image through frontend

module.exports = router