const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const AuditLog = sequelize.define("AuditLog",{

    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },


    action:{
        type:DataTypes.STRING,
        allowNull:false
    },


    documentId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },


    details:{
        type:DataTypes.TEXT
    }


});


module.exports=AuditLog;