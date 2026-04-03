const Record = require('../models/Record');

// @desc    Get all financial records (with filtering)
// @route   GET /api/records
// @access  Public (Will be protected later)
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    // Build query object
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Record.find(query).populate('user', 'name email').sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single record by ID
// @route   GET /api/records/:id
// @access  Public (Will be protected later)
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('user', 'name email');
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new financial record
// @route   POST /api/records
// @access  Public (Will be protected later)
const createRecord = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  try {
    const record = new Record({
      user: req.user._id,
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
    });

    const createdRecord = await record.save();
    res.status(201).json(createdRecord);
  } catch (error) {
    res.status(400).json({ message: 'Invalid record data', error: error.message });
  }
};

// @desc    Update a financial record
// @route   PUT /api/records/:id
// @access  Public (Will be protected later)
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (record) {
      record.amount = req.body.amount || record.amount;
      record.type = req.body.type || record.type;
      record.category = req.body.category || record.category;
      record.date = req.body.date || record.date;
      record.notes = req.body.notes !== undefined ? req.body.notes : record.notes;

      const updatedRecord = await record.save();
      res.json(updatedRecord);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating record', error: error.message });
  }
};

// @desc    Delete a financial record
// @route   DELETE /api/records/:id
// @access  Public (Will be protected later)
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (record) {
      await record.deleteOne();
      res.json({ message: 'Record removed' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record', error: error.message });
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
