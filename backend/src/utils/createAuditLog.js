const AuditLog=require("../models/AuditLog");


const createAuditLog =
async(userId,action,documentId,details)=>{


    await AuditLog.create({

        userId:userId,

        action:action,

        documentId:documentId,

        details:details

    });


};


module.exports=createAuditLog;