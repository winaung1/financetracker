import React, { useState } from 'react';
import api from '../services/api';

const AddBill = ({ onBillAdded }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [categories] = useState([
    { label: 'Rent', value: 'rent' },
    { label: 'Utilities', value: 'utilities' },
    { label: 'Internet', value: 'internet' },
    { label: 'Other', value: 'other' }
  ]);
  const [error, setError] = useState('');

  const handleAddBill = async (e) => {
    e.preventDefault();
    
    // Check if "Other" is selected but no custom category is provided
    if (category === 'other' && !customCategory.trim()) {
      setError('Please enter a custom category.');
      return; // Stop submission if no custom category is provided
    }
    
    // Check if custom category is not valid (this check could be based on some predefined format or length)
    if (customCategory.trim() && customCategory.length < 3) {
      setError('Custom category should be at least 3 characters.');
      return;
    }

    setError(''); // Reset error if form is valid

    try {
      const categoryName = category === 'other' ? customCategory : category;
      const response = await api.post('/bills', { 
        name, 
        amount: parseFloat(amount), 
        dueDate, 
        category: categoryName
      });
      if (response.data) {
        setName('');
        setAmount('');
        setDueDate('');
        setCategory('');
        setCustomCategory('');
      }
    } catch (error) {
      console.error('Error adding bill:', error);
      setError('Failed to add the bill. Please try again.');
    }
  };

  return (
    <form onSubmit={handleAddBill} className="p-4 bg-gray-100 rounded">
      <h3 className="font-semibold mb-2">Add New Bill</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Bill Name"
        className="block w-full p-2 mb-2 border rounded"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="block w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder='Due on month...'
        className="block w-full p-2 mb-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      {category === 'other' && (
        <input
          type="text"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          placeholder="Enter custom category"
          className="block w-full p-2 mb-2 border rounded"
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Bill
      </button>
    </form>
  );
};

export default AddBill;
