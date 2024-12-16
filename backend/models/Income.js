const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  customCategory: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
