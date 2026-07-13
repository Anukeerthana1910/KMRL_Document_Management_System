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


status:{
type:DataTypes.ENUM(
"Pending",
"Approved",
"Rejected"
),
defaultValue:"Pending"
}

});


module.exports=Document;