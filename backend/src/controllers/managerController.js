const User = require("../models/User");
const Document = require("../models/Document");


// Dashboard

exports.dashboard = async(req,res)=>{

    try{

        const documents =
        await Document.count();


        const users =
        await User.count();


        res.json({

            users,
            documents

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// View Users

exports.users = async(req,res)=>{

    try{

        const users =
        await User.findAll({

            where:{
                role:"USER"
            }

        });


        res.json(users);


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


        const document =
        await Document.create({

            title:req.body.title,

            filePath:req.file.path,

            category:req.body.category,

            summary:req.body.summary,

            status:"Pending"

        });



        res.json({

            message:"Document uploaded",

            document

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// View Documents

exports.documents = async(req,res)=>{

    try{


        const documents =
        await Document.findAll();



        res.json(documents);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Approve Document

exports.approve = async(req,res)=>{

    try{


        await Document.update(

            {
                status:"Approved"
            },

            {
                where:{
                    id:req.params.id
                }
            }

        );


        res.json({

            message:"Document approved"

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Reject Document

exports.reject = async(req,res)=>{

    try{


        await Document.update(

            {
                status:"Rejected"
            },

            {
                where:{
                    id:req.params.id
                }
            }

        );


        res.json({

            message:"Document rejected"

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Reports

exports.reports = async(req,res)=>{

    try{


        const total =
        await Document.count();


        res.json({

            totalDocuments:total

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};