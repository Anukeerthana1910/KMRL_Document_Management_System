const User = require("../models/User");
const Document = require("../models/Document");
const bcrypt = require("bcrypt");

const createAuditLog =
require("../utils/createAuditLog");
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


const fs = require("fs");


// User delete own document only

exports.deleteDocument = async(req,res)=>{

    try{

        const document =
        await Document.findByPk(req.params.id);


        if(!document){

            return res.status(404).json({
                message:"Document not found"
            });

        }


        // check ownership

        if(
            document.uploadedBy != req.body.userId
        ){

            return res.status(403).json({

                message:
                "You can delete only your uploaded documents"

            });

        }



        // user cannot delete manager files

        if(
            document.uploadedRole === "MANAGER"
        ){

            return res.status(403).json({

                message:
                "Cannot delete manager document"

            });

        }



        await Document.destroy({

            where:{
                id:req.params.id
            }

        });

        await createAuditLog(

    req.body.userId,

    "DELETE_DOCUMENT",

    document.id,

    `User deleted document ${document.title}`

);

        res.json({

            message:"Document deleted"

        });


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

// Upload Document

exports.uploadDocument = async(req,res)=>{

    try{


        if(!req.file){

            return res.status(400).json({

                message:"File required"

            });

        }


        const document =
        await Document.create({

            title:req.body.title,

            filePath:req.file.path,

            category:req.body.category,

            summary:req.body.summary,


            // user id from request

            uploadedBy:req.body.userId,


            uploadedRole:"USER",


            status:"Pending"

        });



        res.json({

            message:"Document uploaded successfully",

            document

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