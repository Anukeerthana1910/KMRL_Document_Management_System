const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const Complaint = sequelize.define("Complaint",{

    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },


    subject:{
        type:DataTypes.STRING,
        allowNull:false
    },


    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },


    status:{
        type:DataTypes.ENUM(
            "Pending",
            "In Progress",
            "Resolved",
            "Rejected"
        ),
        defaultValue:"Pending"
    },


    reply:{
        type:DataTypes.TEXT
    }


});


module.exports=Complaint;