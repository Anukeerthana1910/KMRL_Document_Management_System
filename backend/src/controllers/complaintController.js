const Complaint=require("../models/Complaint");


// User submit complaint

exports.createComplaint=async(req,res)=>{

    try{

        const complaint=
        await Complaint.create({

            userId:req.body.userId,

            subject:req.body.subject,

            description:req.body.description

        });


        res.json({

            message:"Complaint submitted",

            complaint

        });


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// User view own complaints

exports.myComplaints=async(req,res)=>{

    try{

        const complaints=
        await Complaint.findAll({

            where:{
                userId:req.query.userId
            }

        });


        res.json(complaints);


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};