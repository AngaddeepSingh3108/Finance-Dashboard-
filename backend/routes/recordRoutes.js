const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getRecords,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validate');

const recordValidation = [
  check('amount', 'Amount is required and must be a number').isNumeric(),
  check('type', 'Type must be either income or expense').isIn(['income', 'expense']),
  check('category', 'Category is required').not().isEmpty(),
];

// Viewer, Analyst, Admin can view
router.route('/')
  .get(protect, authorize('Viewer', 'Analyst', 'Admin'), getRecords)
  .post(protect, authorize('Admin', 'Analyst'), recordValidation, validateRequest, createRecord);

// Viewer can't fetch single? Let's say all can fetch single. Only Admin/Analyst can modify.
router.route('/:id')
  .get(protect, authorize('Viewer', 'Analyst', 'Admin'), getRecordById)
  .put(protect, authorize('Admin', 'Analyst'), recordValidation, validateRequest, updateRecord)
  .delete(protect, authorize('Admin'), deleteRecord); // Only admin can delete

module.exports = router;
