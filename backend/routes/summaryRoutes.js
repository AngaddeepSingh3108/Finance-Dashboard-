const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Viewer', 'Analyst', 'Admin'), getSummary);

module.exports = router;
