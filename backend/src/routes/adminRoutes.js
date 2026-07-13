const router = require("express").Router();

const admin =
require("../controllers/adminController");


// Create Manager

router.post(
    "/managers",
    admin.createManager
);


// Delete Manager

router.delete(
    "/managers/:id",
    admin.deleteManager
);


// Create Department

router.post(
    "/departments",
    admin.createDepartment
);


// View all Documents

router.get(
    "/documents",
    admin.documents
);


// Delete Document

router.delete(
    "/documents/:id",
    admin.deleteDocument
);


module.exports = router;