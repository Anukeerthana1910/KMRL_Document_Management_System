const Comment=require("../models/Comment");


// Add comment

exports.addComment=async(req,res)=>{


const comment=
await Comment.create({

document:req.params.id,

user:req.user.id,

comment:req.body.comment

});


res.json({

message:"Comment added successfully",

comment

});


};




// View comments

exports.getComments=async(req,res)=>{


const comments=
await Comment.find({

document:req.params.id

})
.populate(
"user",
"name"
);


res.json(comments);


};