const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
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

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
