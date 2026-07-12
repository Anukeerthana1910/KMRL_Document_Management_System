const router=require("express").Router();

const auth=require("../middleware/authMiddleware");

const role=require("../middleware/roleMiddleware");


router.get(
"/admin",
auth,
role(["ADMIN"]),
(req,res)=>{

res.json({
message:"Admin Access"
});

}
);


router.get(
"/manager",
auth,
role(["MANAGER"]),
(req,res)=>{

res.json({
message:"Manager Access"
});

}
);



router.get(
"/employee",
auth,
role(["EMPLOYEE"]),
(req,res)=>{

res.json({
message:"Employee Access"
});

}
);


module.exports=router;