const express = require("express");

const router = express.Router();

const userController =
require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");

router.get(
"/profile/:id",
userController.getProfile
);


router.get(
"/my-documents",
userController.myDocuments
);


router.put(
"/profile",
userController.updateProfile
);


router.put(
"/change-password",
userController.changePassword
);

router.post(
"/documents/upload",
upload.single("file"),
userController.uploadDocument
);
router.delete(
    "/documents/:id",
    userController.deleteDocument
);
const complaintController =
require("../controllers/complaintController");



router.post(
"/complaints",
complaintController.createComplaint
);



router.get(
"/complaints",
complaintController.myComplaints
);
module.exports = router;