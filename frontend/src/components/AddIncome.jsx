import React, { useState } from 'react';
import api from '../services/api';

const AddIncome = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [categories] = useState([
    { label: 'Salary', value: 'salary' },
    { label: 'Freelance', value: 'freelance' },
    { label: 'Investment', value: 'investment' },
    { label: 'Other', value: 'other' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If "Other" is selected, use the custom category name
      const categoryName = category === 'other' ? customCategory : category;
      await api.post('/income', { 
        amount: parseFloat(amount),
        category: categoryName
      });
      setAmount('');
      setCategory('');
      setCustomCategory('');
      alert('Income added successfully!');
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  return (
    <div className="p-4 border border-gray-500 text-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add Income</h2>
      <form onSubmit={handleSubmit}>
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
          Add Income
        </button>
      </form>
    </div>
  );
};

export default AddIncome;
