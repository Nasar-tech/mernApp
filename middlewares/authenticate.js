const jwt=require("jsonwebtoken");
const User=require("../models/userSchema");





const authenticate=async(req,res,next)=>{
    try{
        console.log('hello from authentication');
        const token= req.cookies.jwttoken;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        const rootUser=await User.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!rootUser){
            throw new Error("user not found");
        }

        req.rootUser=rootUser;
        req.token=token;
        req.userId=rootUser._id;

        next();


    }catch(ex){
        res.status(400).send("Authentication Error: no Token Provided");
        console.log("Authenticatioin Error", ex);
    }
}
module.exports=authenticate;


