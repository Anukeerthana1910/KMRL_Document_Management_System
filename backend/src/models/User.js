const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");


const User=sequelize.define("User",{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},

name:{
type:DataTypes.STRING
},

email:{
type:DataTypes.STRING,
unique:true
},

password:{
type:DataTypes.STRING
},

role:{
type:DataTypes.STRING,
defaultValue:"EMPLOYEE"
}

});


module.exports=User;