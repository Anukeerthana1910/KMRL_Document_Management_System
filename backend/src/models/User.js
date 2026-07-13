const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");


const User=sequelize.define(
"User",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},


name:{
type:DataTypes.STRING,
allowNull:false
},


email:{
type:DataTypes.STRING,
unique:true
},


password:{
type:DataTypes.STRING
},


role:{
type:DataTypes.ENUM(
"USER",
"MANAGER",
"ADMIN"
),
defaultValue:"USER"
}

});


module.exports=User;