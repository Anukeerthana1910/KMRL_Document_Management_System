const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const Document=
sequelize.define(
"Document",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},


title:{
type:DataTypes.STRING
},


filePath:{
type:DataTypes.STRING
},


category:{
type:DataTypes.STRING
},


summary:{
type:DataTypes.TEXT
},
extractedText:{
    type:DataTypes.TEXT,
    allowNull:true
},



status:{
type:DataTypes.ENUM(
"Pending",
"Approved",
"Rejected"
),
defaultValue:"Pending"
},
uploadedBy:{
    type: DataTypes.INTEGER,
    allowNull:false
},

uploadedRole:{
    type: DataTypes.ENUM(
        "USER",
        "MANAGER"
    ),
    allowNull:false
}
});


module.exports=Document;