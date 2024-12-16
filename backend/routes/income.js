const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Route to add income
router.post('/', async (req, res) => {
    const { amount, category, customCategory } = req.body;
  
    if (category === 'other' && !customCategory) {
      return res.status(400).json({ message: 'Custom category is required when selecting "Other".' });
    }
  
    try {
      const newIncome = new Income({
        amount,
        category,
        customCategory: category === 'other' ? customCategory : '', // Only set customCategory if 'other' is selected
      });
  
      const savedIncome = await newIncome.save();
  
      return res.status(201).json(savedIncome);
    } catch (error) {
      console.error('Error adding income:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

router.get('/', async (req, res) => {
  try {
    const income = await Income.find();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
