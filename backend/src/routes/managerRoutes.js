const router = require("express").Router();

const controller =
require("../controllers/managerController");

const upload =
require("../middleware/uploadMiddleware");


// Dashboard

router.get(
"/dashboard",
controller.dashboard
);


// View users

router.get(
"/users",
controller.users
);


// Upload document

router.post(
"/documents/upload",
upload.single("file"),
controller.uploadDocument
);


// View documents

router.get(
"/documents",
controller.documents
);


// Approve

router.put(
"/documents/:id/approve",
controller.approve
);


// Reject

router.put(
"/documents/:id/reject",
controller.reject
);


// Reports

router.get(
"/reports",
controller.reports
);


module.exports=router;