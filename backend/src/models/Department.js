const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const Department=sequelize.define(
"Department",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},


name:{
type:DataTypes.STRING,
unique:true
},


description:{
type:DataTypes.TEXT
}

});


module.exports=Department;