const User = require("../models/User");
const bcrypt = require("bcrypt");


// Signup

exports.signup = async(req,res)=>{

    try{

        const {
            name,
            email,
            password
        } = req.body;


        const existingUser =
        await User.findOne({
            where:{
                email:email
            }
        });


        if(existingUser)
        {
            return res.status(400).json({
                message:"Email already exists"
            });
        }


        const hashPassword =
        await bcrypt.hash(password,10);


        const user =
        await User.create({

            name:name,

            email:email,

            password:hashPassword,

            role:"USER"

        });


        res.status(201).json({

            message:"Signup successful",

            user:{
                id:user.id,
                name:user.name,
                role:user.role
            }

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// Login

exports.login = async(req,res)=>{

    try{

        const {
            email,
            password
        }=req.body;



        const user =
        await User.findOne({

            where:{
                email:email
            }

        });



        if(!user)
        {
            return res.status(404).json({
                message:"User not found"
            });
        }



        const match =
        await bcrypt.compare(
            password,
            user.password
        );



        if(!match)
        {
            return res.status(401).json({
                message:"Invalid password"
            });
        }



        res.json({

            message:"Login successful",

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};