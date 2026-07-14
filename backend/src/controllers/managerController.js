const User = require("../models/User");
const Document = require("../models/Document");

const createAuditLog =
require("../utils/createAuditLog");
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
const extractText = require("../services/textExtractionService");


exports.uploadDocument = async(req,res)=>{

try{


console.log("BODY:",req.body);

console.log("FILE:",req.file);


// extract text

const text = await extractText(
    req.file.path
);



const document = await Document.create({

title:req.body.title,

filePath:req.file.path,

category:req.body.category,

summary:req.body.summary,

extractedText:text,

status:"Pending",


// manager id from frontend

uploadedBy:Number(req.body.managerId),

uploadedRole:"MANAGER"

});


res.json({

message:"Document uploaded successfully",

document

});


}

catch(error){

console.error(error);

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

// Manager can delete USER and MANAGER documents

exports.deleteDocument = async(req,res)=>{

    try{


        const document =
        await Document.findByPk(req.params.id);



        if(!document){

            return res.status(404).json({

                message:"Document not found"

            });

        }



        await Document.destroy({

            where:{
                id:req.params.id
            }

        });

await createAuditLog(

    req.body.managerId,

    "DELETE_DOCUMENT",

    document.id,

    `Manager deleted document ${document.title}`

);

        res.json({

            message:
            "Document deleted by manager"

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