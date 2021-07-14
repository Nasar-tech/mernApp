const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');

const authenticate=require('../middlewares/authenticate');


//Data base connection
require("../DB/conn")
//importing model
const User=require("../models/userSchema");



//usign custom middleware to chenck authentication
router.get('/about',authenticate,(req,res)=>{
    console.log('from server about page');
    res.send(req.rootUser);
});



//get data for home page and contact us page

router.get('/getData',authenticate,(req,res)=>{
    console.log('from get data method');
    res.send(req.rootUser);
});

//logout page
router.get('/logout',(req,res)=>{
    console.log('backend logout page');
    res.clearCookie('jwttoken',{path:'/'})
    res.status(200).send('user logout');
})



//contactus page

router.post('/contact',authenticate,async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body;
        if(!name||!email||!phone||!message){
            console.log("error in contact form");
            return res.status(400).json({error:'fill contact form'});
        }
        const userContact=await User.findOne({_id:req.userId});

        if(userContact){
            const userMessage= await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201);
        }
    }catch(err){
        console.log(err);
    }

})





//for signin page
router.post('/signin',async(req,res)=>{
    try{    
        const {email,password}=req.body;

        if(!email||!password){
            return res.send(400).json({message:"please fill all fields"});
        }

        const userLogin=await User.findOne({email:email});
        if(userLogin){
            const ismatch=await bcrypt.compare(password,userLogin.password);
            const token=await userLogin.generateAuthToken();
            // console.log(token);
            
            res.cookie("jwttoken",token,{
                expires:new Date(Date.now()+86400000),
                httpOnly:true
            });



            if(!ismatch){
                res.status(400).json({message:"invalid credentials"});
            }else{
                res.json({message:"login successfully"});
            }
        }else{
            res.status(400).json({message:"invalid credentials"});
        } 
        
    }
    catch(err){
        console.log(err);
    }
});
router.get('/signup',(req,res)=>{
    res.send('hello frm signup');
})

router.post('/register',async(req,res)=>{
    try{    
        const{name,email,phone,work,password,cpassword}=req.body;
        if(!name||!email||!phone||!work||!password||!cpassword){
            res.status(400).send('please fill all fields').json({message:"all fields are required"});
        }
        const existUser=await User.findOne({email:email});
        if(existUser){
            return res.status(400).json({message:"already exist"});
        }
        const userLogin=new User({name,email,phone,work,password,cpassword});
        //adding middleware to hashing password
        await userLogin.save();
        res.status(201).json({message:"data created successfully"});
    }catch(err){
        console.log(err);
    }
})

//**************by using callbacks********************
// router.post('/register',(req,res)=>{    
//     const{name,email,phone,work,password,cpassword}=req.body;
//     if(!name||!email||!phone||!work||!password||!cpassword){
//         return res.status(400).json({error:'please fill all fields'});
//     }
//     User.findOne({email:email})
//         .then((userExist)=>{
//             if(userExist){
//                 return res.status(400).json({message:'email exist'});
//             }
//             const userLogin.password=;new User({name,email,phone,work,password,cpassword});
//             userLogin.password.;save().then(()=>{res.status(201).json({message:'created successfully'})})
//                         .catch((err)=>{res.status(400).json({message:'not saved in database'})});
//         }).catch(err=>{console.log('problem in finding email',err)});
    

// });


module.exports=router


