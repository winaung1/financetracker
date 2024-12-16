const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add expense
router.post('/', async (req, res) => {
    const { name, amount, category, customCategory } = req.body;
  
    if (category === 'other' && !customCategory) {
      return res.status(400).json({ message: 'Custom category is required when selecting "Other".' });
    }
  
    try {
      const newExpense = new Expense({
        name,
        amount,
        category,
        customCategory: category === 'other' ? customCategory : '', // Only set customCategory if 'other' is selected
      });
  
      const savedExpense = await newExpense.save();
  
      return res.status(201).json(savedExpense);
    } catch (error) {
      console.error('Error adding expense:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.name = req.body.name || expense.name;
    expense.amount = req.body.amount || expense.amount;
    expense.category = req.body.category || expense.category;
    expense.customCategory = req.body.customCategory || expense.customCategory;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a expense
router.delete('/:id', async (req, res) => {
    try {
        const result = await Expense.findByIdAndDelete(req.params.id); // assuming `Bill` is your model
    
        if (!result) {
          console.log('Item not found');
          return;
        }
    
        console.log('Item deleted successfully:', result);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
});

module.exports = router;
