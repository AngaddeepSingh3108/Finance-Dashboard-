const Record = require('../models/Record');

// @desc    Get dashboard summary (totals, category breakdown, recent activity)
// @route   GET /api/summary
// @access  Public (Will be protected later)
const getSummary = async (req, res) => {
  try {
    // 1. Calculate grand totals
    const records = await Record.find();
    
    let totalIncome = 0;
    let totalExpenses = 0;

    records.forEach((record) => {
      if (record.type === 'income') {
        totalIncome += record.amount;
      } else if (record.type === 'expense') {
        totalExpenses += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;

    // 2. Category-wise breakdown
    const categoryTotals = {};
    records.forEach((record) => {
      if (!categoryTotals[record.category]) {
        categoryTotals[record.category] = 0;
      }
      categoryTotals[record.category] += record.amount;
    });

    // 3. Recent activity (last 5 records)
    const recentActivity = await Record.find()
      .populate('user', 'name')
      .sort({ date: -1 })
      .limit(5);

    res.json({
      totals: {
        totalIncome,
        totalExpenses,
        netBalance,
      },
      categoryBreakdown: categoryTotals,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getSummary };
