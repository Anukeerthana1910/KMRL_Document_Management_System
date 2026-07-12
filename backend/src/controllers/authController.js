const User=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


// REGISTER

exports.register=async(req,res)=>{

try{

const {name,email,password,role}=req.body;


const hash=await bcrypt.hash(password,10);


const user=await User.create({

name,
email,
password:hash,
role

});


res.json(user);


}
catch(error){

res.status(500).json({
message:error.message
});

}

}



// LOGIN

exports.login=async(req,res)=>{

const {email,password}=req.body;


const user=await User.findOne({
where:{email}
});


if(!user)
return res.status(404).json({
message:"User not found"
});


const valid=await bcrypt.compare(
password,
user.password
);


if(!valid)
return res.status(401).json({
message:"Invalid password"
});


const token=jwt.sign(
{
id:user.id,
role:user.role
},
process.env.JWT_SECRET,
{
expiresIn:"1h"
}
);



res.json({

token,
role:user.role

});


}