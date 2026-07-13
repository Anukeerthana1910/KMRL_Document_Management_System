const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const Comment=
sequelize.define(
"Comment",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},


comment:{
type:DataTypes.TEXT
}

});


module.exports=Comment;