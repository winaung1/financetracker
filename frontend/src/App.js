import React, { useState } from "react";
import AddIncome from "./components/AddIncome";
import AddExpense from "./components/AddExpense";
import AddBill from "./components/AddBill";
import Dashboard from "./components/Dashboard";
import { Sidebar } from "./components/Sidebar";
import IncomeCalculator from "./components/IncomeCalculator";

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard'); // Default to Dashboard

  // Handler to toggle between Dashboard and Payments views
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#101419] p-4 ">
      <div className="flex">
        <div className="hidden lg:flex w-80 ">
        <Sidebar onTabChange={handleTabChange} />
        </div>
        <div className="w-full">

          {/* Conditionally render content based on activeTab */}
          {activeTab === 'Dashboard' ? (
            <Dashboard />
          ) : (
            ""
          )}
          {/* Conditionally render content based on activeTab */}
          {activeTab === 'Add Payments' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <AddIncome />
              <AddExpense />
              <AddBill />
            </div>
          ) : (
            ""
          )}
          {/* Conditionally render content based on activeTab */}
          {activeTab === 'Calculate Income' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <IncomeCalculator/>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
