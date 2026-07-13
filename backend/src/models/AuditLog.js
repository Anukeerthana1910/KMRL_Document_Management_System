const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const AuditLog=sequelize.define(
"AuditLog",
{

id:{
type:DataTypes.INTEGER,
primaryKey:true,
autoIncrement:true
},


action:{
type:DataTypes.STRING,
allowNull:false
},


userId:{
type:DataTypes.INTEGER
},


documentId:{
type:DataTypes.INTEGER
}

},
{
timestamps:true
}

);


module.exports=AuditLog;