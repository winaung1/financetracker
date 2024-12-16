import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeCalculator = () => {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [hoursPerWeek, setHoursPerWeek] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [payPeriod, setPayPeriod] = useState('weekly');
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [selectedState, setSelectedState] = useState('California');
  const [stateOptions, setStateOptions] = useState([]);

  // Replace with your TaxJar API key
  const TAXJAR_API_KEY = 'f54ac37870a9ffcdf32a9cef0f0d5548';

  // Fetch tax rate for a specific state using TaxJar API
  const fetchTaxRate = async (state) => {
    try {
      const response = await axios.get(
        `https://api.taxjar.com/v2/rates/${state}`,
        {
          headers: {
            Authorization: `Bearer ${TAXJAR_API_KEY}`,
          },
        }
      );
      const rate = response.data.rate.combined_rate * 100; // Tax rate in percentage
      setTaxRate(rate);
      console.log(rate)
    } catch (error) {
      console.error('Error fetching tax rate:', error);
      setTaxRate(0); // Fallback if API call fails
    }
  };

  // Function to calculate income based on the selected pay period
  const calculateIncome = () => {
    const regularIncome = hourlyWage * Math.min(hoursPerWeek, 40); // Regular hours are capped at 40 hours a week
    const overtimeIncome = overtimeHours * hourlyWage * overtimeRate;

    let totalIncome = regularIncome + overtimeIncome;
    
    if (payPeriod === 'bi-weekly') {
      totalIncome *= 2;
    } else if (payPeriod === 'monthly') {
      totalIncome *= 4;
    }

    totalIncome -= otherDeductions;
    
    return totalIncome;
  };

  // Calculate after-tax income
  const calculateAfterTaxIncome = () => {
    const totalIncome = calculateIncome();
    const taxAmount = totalIncome * (taxRate / 100); // Calculate tax amount
    return totalIncome - taxAmount; // Subtract tax from total income
  };

  // Calculate tax amount
  const calculateTaxAmount = () => {
    const totalIncome = calculateIncome();
    return totalIncome * (taxRate / 100); // Tax amount based on total income
  };

  // Handle State Change and Update Tax Rate
  const handleStateChange = (state) => {
    setSelectedState(state);
    fetchTaxRate(state); // Fetch tax rate for the selected state
  };

  // Handle input change
  const handleInputChange = (e, setter) => {
    const value = e.target.value;
    setter(value === "" ? 0 : parseFloat(value) || 0); // If empty, set to 0, otherwise parse as float
  };

  useEffect(() => {
    // Fetch a list of states (you can replace this with actual API or static data)
    const states = [
      'California', 'Texas', 'Florida', 'New York', 'Illinois'
    ];
    setStateOptions(states);

    // Fetch tax rate for the default selected state
    fetchTaxRate(selectedState);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">Income Calculator</h2>
      
      <div className="space-y-4">
        {/* Hourly Wage */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Hourly Wage ($):</label>
          <input
            type="number"
            value={hourlyWage || 0}
            onChange={(e) => handleInputChange(e, setHourlyWage)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Hours Worked Per Week */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Hours Worked Per Week:</label>
          <input
            type="number"
            value={hoursPerWeek || 0}
            onChange={(e) => handleInputChange(e, setHoursPerWeek)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Overtime Hours */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Overtime Hours:</label>
          <input
            type="number"
            value={overtimeHours || 0}
            onChange={(e) => handleInputChange(e, setOvertimeHours)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Overtime Rate */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Overtime Rate (e.g. 1.5x):</label>
          <input
            type="number"
            value={overtimeRate || 1.5}
            onChange={(e) => handleInputChange(e, setOvertimeRate)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pay Period */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Select Pay Period:</label>
          <select
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* State Selection */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Select State:</label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Other Deductions */}
        <div className="flex flex-col">
          <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">Other Deductions ($):</label>
          <input
            type="number"
            value={otherDeductions || 0}
            onChange={(e) => handleInputChange(e, setOtherDeductions)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Display Results */}
        <div className="mt-6 space-y-4">
          <div className="text-lg font-semibold">Total Income Before Tax: ${calculateIncome().toFixed(2)}</div>
          <div className="text-lg font-semibold">Tax Amount: ${calculateTaxAmount().toFixed(2)}</div>
          <div className="text-lg font-semibold">Income After Tax: ${calculateAfterTaxIncome().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default IncomeCalculator;
