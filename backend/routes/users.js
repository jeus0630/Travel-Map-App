const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// register
router.post("/register",async (req,res) => {
    try{

        //check if username is valid
        const isUserInValid = await User.findOne({username: req.body.username});
        if (isUserInValid) {
            console.log('???');
            res.status(400).json({
                status: {
                username: false
            }})
            return;
        }

        //check if email is valid
        // const isEmailInvalid = (await User.find({})).filter(user => user.email === req.body.email);
        // if (isEmailInvalid) {
        //     res.status(400).json({
        //         status: {
        //         email: false
        //     }})
        //     return;
        // }
        
        //generate new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })

        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

  
// login
router.post('/login',async (req,res)=>{ 
    try{
        //find user
        const user = await User.findOne({username: req.body.username});
        
        if(!user){
            res.status(400).json("Wrong username or password");
            return;
        }
    
    
        //validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.status(400).json("Wrong username or password");
            return;
        }
    
    
        //send
        res.status(200).json({_id:user._id, username: req.body.username});
    
    }catch(err){
        console.log(err);
        res.status(500).json(err); 
    }
})

module.exports = router;