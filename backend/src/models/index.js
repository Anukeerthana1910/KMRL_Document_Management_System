const User=require("./User");
const Department=require("./Department");
const Document=require("./Document");
const Comment=require("./Comment");


// Department - Users

Department.hasMany(User);

User.belongsTo(Department);


// User - Documents

User.hasMany(Document,{
foreignKey:"uploadedBy"
});

Document.belongsTo(User,{
foreignKey:"uploadedBy"
});


// Department - Documents

Department.hasMany(Document);

Document.belongsTo(Department);


// Documents - Comments

Document.hasMany(Comment);

Comment.belongsTo(Document);


User.hasMany(Comment);

Comment.belongsTo(User);


module.exports={
User,
Department,
Document,
Comment
}