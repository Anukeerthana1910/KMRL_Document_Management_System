const User = require("../models/User");
const Document = require("../models/Document");
const bcrypt = require("bcrypt");


// View Profile

exports.getProfile = async(req,res)=>{

    try{

        const user =
        await User.findByPk(req.params.id);


        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }


        res.json(user);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// View My Documents

exports.myDocuments = async(req,res)=>{

    try{

        const documents =
        await Document.findAll({

            where:{
                uploadedBy:req.query.userId
            }

        });


        res.json(documents);

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Update Profile

exports.updateProfile = async(req,res)=>{

    try{

        await User.update(

            {
                name:req.body.name,
                email:req.body.email
            },

            {
                where:{
                    id:req.body.id
                }
            }

        );


        res.json({
            message:"Profile updated"
        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Change Password

exports.changePassword = async(req,res)=>{

    try{

        const hash =
        await bcrypt.hash(
            req.body.password,
            10
        );


        await User.update(

            {
                password:hash
            },

            {
                where:{
                    id:req.body.id
                }
            }

        );


        res.json({
            message:"Password changed"
        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};