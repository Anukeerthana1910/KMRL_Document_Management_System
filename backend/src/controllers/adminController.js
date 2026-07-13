const User = require("../models/User");
const Document = require("../models/Document");
const Department = require("../models/Department");
const bcrypt = require("bcrypt");


// Create Manager

exports.createManager = async(req,res)=>{

    try{

        const password =
        await bcrypt.hash(
            req.body.password,
            10
        );


        const manager =
        await User.create({

            name:req.body.name,

            email:req.body.email,

            password:password,

            role:"MANAGER",

            department:req.body.department

        });


        res.json({

            message:"Manager created",

            manager

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Delete Manager

exports.deleteManager = async(req,res)=>{

    try{


        await User.destroy({

            where:{
                id:req.params.id,
                role:"MANAGER"
            }

        });


        res.json({

            message:"Manager deleted"

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Create Department

exports.createDepartment = async(req,res)=>{

    try{


        const dept =
        await Department.create({

            name:req.body.name,

            description:req.body.description

        });


        res.json(dept);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// View All Documents

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



// Delete Document

exports.deleteDocument = async(req,res)=>{

    try{


        await Document.destroy({

            where:{
                id:req.params.id
            }

        });


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