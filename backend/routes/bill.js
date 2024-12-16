const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Route to add bill
router.post('/', async (req, res) => {
    const { name, amount, dueDate, category, customCategory } = req.body;
  
    if (category === 'other' && !customCategory) {
      return res.status(400).json({ message: 'Custom category is required when selecting "Other".' });
    }
  
    try {
      const newBill = new Bill({
        name,
        amount,
        dueDate,
        category,
        customCategory: category === 'other' ? customCategory : '', // Only set customCategory if 'other' is selected
      });
  
      const savedBill = await newBill.save();
  
      return res.status(201).json(savedBill);
    } catch (error) {
      console.error('Error adding bill:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

// Get all Bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills); // Return all bills
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a Bill
router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Update fields only if they exist in the request body
    bill.name = req.body.name || bill.name;
    bill.dueDate = req.body.dueDate || bill.dueDate;
    bill.amount = req.body.amount || bill.amount;
    bill.category = req.body.category || bill.category;
    bill.customCategory = req.body.customCategory || bill.customCategory;

    const updatedBill = await bill.save();
    res.json(updatedBill); // Return the updated bill
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Bill
router.delete('/:id', async (req, res) => {
    try {
        const result = await Bill.findByIdAndDelete(req.params.id); // assuming `Bill` is your model
    
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
