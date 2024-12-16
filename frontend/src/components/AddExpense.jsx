import React, { useState } from 'react';
import api from '../services/api';

const AddExpense = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [categories] = useState([
    { label: 'Food', value: 'food' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Other', value: 'other' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // If the category is 'other', we use the custom category provided by the user
    const categoryName = category === 'other' ? customCategory : category;

    // If there's no custom category provided, we show an error
    if (category === 'other' && !customCategory) {
      alert('Please enter a custom category');
      return;
    }
      await api.post('/expenses', { 
        name, 
        amount: parseFloat(amount),
        category: categoryName
      });
      setName('');
      setAmount('');
      setCategory('');
      setCustomCategory('');
      alert('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="p-4 border border-gray-500 text-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-2 bg-transparent border-gray-500"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2 bg-transparent border-gray-500"
          required
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
