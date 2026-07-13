const express = require("express");

const router = express.Router();

const userController =
require("../controllers/userController");



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


module.exports = router;