const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getAuditLogs
} = require("../controllers/auditController");


// Admin can view audit logs

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["ADMIN"]),
    getAuditLogs
);


module.exports = router;