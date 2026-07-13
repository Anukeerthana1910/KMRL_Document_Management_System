const router = require("express").Router();

const {
    getDocuments,
    getDocument,
    downloadDocument,
    searchDocuments
} = require("../controllers/documentController");


const commentController =
require("../controllers/commentController");


// View all documents

router.get(
    "/",
    getDocuments
);


// View document details

router.get(
    "/:id",
    getDocument
);


// Search documents

router.get(
    "/search",
    searchDocuments
);


// Download document

router.get(
    "/:id/download",
    downloadDocument
);


// Add comment

router.post(
    "/:id/comments",
    commentController.addComment
);


// View comments

router.get(
    "/:id/comments",
    commentController.getComments
);


module.exports = router;