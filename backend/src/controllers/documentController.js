const Document = require("../models/Document");
const { Op } = require("sequelize");


// Get all documents

exports.getDocuments = async(req,res)=>{

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



// Get document details

exports.getDocument = async(req,res)=>{

    try{


        const document =
        await Document.findByPk(req.params.id);


        if(!document){

            return res.status(404).json({
                message:"Document not found"
            });

        }


        res.json(document);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Search documents

exports.searchDocuments = async(req,res)=>{

    try{

        const keyword =
        req.query.q;


        const documents =
        await Document.findAll({

            where:{

                [Op.or]:[

                    {
                        title:{
                            [Op.like]:`%${keyword}%`
                        }
                    },


                    {
                        category:{
                            [Op.like]:`%${keyword}%`
                        }
                    }

                ]

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



// Download document

exports.downloadDocument = async(req,res)=>{

    try{


        const document =
        await Document.findByPk(req.params.id);


        if(!document){

            return res.status(404).json({
                message:"Document not found"
            });

        }


        res.download(document.filePath);


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};