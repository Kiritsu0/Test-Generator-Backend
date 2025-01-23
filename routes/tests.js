const express = require('express');
const { saveTest, deleteTest, getTests } = require('../controllers/testController');
const { verifyJWT } = require("../middleware/verifyJWT");

const router = express.Router();

// Apply verifyJWT middleware to all routes in this router
router.use(verifyJWT);
router.post('/save', saveTest);
router.delete('/delete/:testId', deleteTest);
router.get('/fetchtests', getTests);

module.exports = router;
