import React, { useEffect, useState } from "react";
import api from "../services/api";
import { GoTrash, GoPencil } from "react-icons/go";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";

const Dashboard = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [billsList, setBillsList] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [updatedExpense, setUpdatedExpense] = useState({ name: "", amount: 0 });
  const [updatedBill, setUpdatedBill] = useState({
    name: "",
    dueDate: "",
    amount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeResponse = await api.get("/income");
        const expensesResponse = await api.get("/expenses");
        const billsResponse = await api.get("/bills");

        setIncomeList(incomeResponse.data);
        setExpensesList(expensesResponse.data);
        setBillsList(billsResponse.data);

        const today = new Date();
        const weekFromToday = new Date(today);
        weekFromToday.setDate(today.getDate() + 7);

        const upcoming = billsResponse.data.filter((bill) => {
          const dueDate = new Date(bill.dueDate);
          return dueDate >= today && dueDate <= weekFromToday;
        });

        setUpcomingBills(upcoming);

        if (upcoming.length > 0) {
          alert(`You have ${upcoming.length} bills due within a week!`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expensesList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // console.log(typeof(totalExpenses).toFixed(2))
  const currentMonth = new Date().getMonth();
  // const monthlyBills = billsList.filter(
  //   (bill) => new Date(bill.dueDate).getMonth() === currentMonth
  // );
  // const totalMonthlyBills = monthlyBills.reduce(
  //   (sum, bill) => sum + bill.amount,
  //   0
  // );
  const endOfMonthBalance = totalIncome - (totalExpenses);

  // Chart data configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } },
    },
  };
  const getNextMonths = (count = 12) => {
    const currentDate = new Date();
    const months = [];
    for (let i = 0; i < count; i++) {
      const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      months.push(nextMonth.toLocaleString("default", { month: "short" }));
    }
    return months;
  };
  
  const chartData = {
    labels: getNextMonths(),  // Dynamically generated months
    datasets: [
      {
        label: "Income",
        data: incomeList.map((item) => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Expenses",
        data: expensesList.map((item) => item.amount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };
  

  // const chartData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  //   datasets: [
  //     {
  //       label: "Income",
  //       data: incomeList.map((item) => item.amount),
  //       backgroundColor: "rgba(75, 192, 192, 0.6)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //     },
  //     {
  //       label: "Expenses",
  //       data: expensesList.map((item) => item.amount),
  //       backgroundColor: "rgba(255, 99, 132, 0.6)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //     },
  //   ],
  // };

  const handleExpenseEdit = (expense) => {
    setSelectedExpense(expense);
    setUpdatedExpense({ name: expense.name, amount: expense.amount });
    setShowExpenseModal(true);
  };

  const handleBillEdit = (bill) => {
    setSelectedBill(bill);
    console.log(bill);
    setUpdatedBill({
      name: bill.name,
      dueDate: bill.dueDate,
      amount: bill.amount,
    });
    setShowBillModal(true);
  };

  const handleExpenseSubmit = async () => {
    try {
      const expenseId = selectedExpense._id; // Get the ID from the selected bill

      const response = await api.put(`/expenses/${expenseId}`, {
        name: updatedExpense.name,
        amount: updatedExpense.amount,
      });

      if (response.status === 200) {
        console.log("Bill updated:", response.data);
        setShowExpenseModal(false); // Close the modal after updating
        // Optionally, you can update the bills list to reflect the change
        setExpensesList((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === expenseId
              ? { ...expense, ...updatedExpense }
              : expense
          )
        );
      } else {
        console.error("Failed to update expense:", response.data);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleBillSubmit = async () => {
    try {
      const billId = selectedBill._id; // Get the ID from the selected bill

      const response = await api.put(`/bills/${billId}`, {
        name: updatedBill.name,
        dueDate: updatedBill.dueDate,
        amount: updatedBill.amount,
      });

      if (response.status === 200) {
        console.log("Bill updated:", response.data);
        setShowBillModal(false); // Close the modal after updating
        // Optionally, you can update the bills list to reflect the change
        setBillsList((prevBills) =>
          prevBills.map((bill) =>
            bill._id === billId ? { ...bill, ...updatedBill } : bill
          )
        );
      } else {
        console.error("Failed to update bill:", response.data);
      }
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleDeleteBill = async (item) => {
    try {
      const response = await api.delete(`/bills/${item._id}`);
      if (response.status === 200) {
        setBillsList(billsList.filter((bill) => bill._id !== item._id)); // Update UI on success
      } else {
        throw new Error("Failed to delete the bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const handleDeleteExpense = async (item) => {
    try {
      const response = await api.delete(`/expenses/${item._id}`);
      if (response.status === 200) {
        setExpensesList(
          expensesList.filter((expense) => expense._id !== item._id)
        ); // Update UI on success
      } else {
        throw new Error("Failed to delete the expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="linear-purple text-white rounded-2xl p-4">
          <h2 className="text-xl text-gray-200">Income</h2>
          <p className="text-3xl py-2">${totalIncome?.toFixed(2)}</p>
        </div>
        <div className="linear-red text-white rounded-2xl p-4">
          <h2 className="text-xl text-gray-200">Expenses</h2>
          <p className="text-3xl py-2">${totalExpenses.toFixed(2)}</p>
        </div>
        {/* <div className="linear-orange text-white rounded-2xl p-4">
          <h2 className="text-xl text-gray-200">Monthly Bills</h2>
          <p className="text-3xl py-2">${totalMonthlyBills.toFixed(2)}</p>
        </div> */}
        <div className="linear-gray text-gray-800 rounded-2xl p-4">
          <h2 className="text-xl text-gray-700">Monthly Balance</h2>
          <p className="text-3xl py-2">${endOfMonthBalance?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 my-4">
        <div className="h-80 bg-[#22282E] p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            Income & Expenses Chart
          </h3>
          <div className="chart-container h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="h-80 bg-[#22282E] p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            Monthly Bills Chart
          </h3>
          <div className="chart-container h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 my-4">
        <div className="bg-[#22282E] p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Income List</h3>
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                 <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>


                  <td className="p-3">{item.category}</td>
                  <td className="p-3">${item.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#22282E] p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">
            Expenses List
          </h3>
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expensesList.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">
                    ${(parseFloat(item.amount) || 0)?.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <div className="relative group flex items-center space-x-4">
                      <button
                        onClick={() => handleExpenseEdit(item)}
                        className="text-yellow-100 hover:text-yellow-500"
                      >
                        <GoPencil size={20} />
                      </button>
                      {/* <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"> */}
                      <button
                        onClick={() => handleDeleteExpense(item)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <GoTrash size={20} />
                      </button>
                      {/* </div> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#22282E] p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Bills List</h3>
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Due Date (Monthly)</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billsList.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.dueDate}</td>


                  <td className="p-3">${item.amount?.toFixed(2)}</td>
                  <td className="p-3">
                    <div className="relative group flex items-center space-x-4">
                      <button
                        onClick={() => handleBillEdit(item)}
                        className="text-yellow-100 hover:text-yellow-500"
                      >
                        <GoPencil size={20} />
                      </button>
                      {/* <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"> */}
                      <button
                        onClick={() => handleDeleteBill(item)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <GoTrash size={20} />
                      </button>
                      {/* </div> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Expense Modal */}
      {showExpenseModal && (
        <div
          className="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowExpenseModal(false);
            }
          }}
        >
          <div
            className="modal-content bg-white p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Expense</h3>
            <input
              type="text"
              value={updatedExpense.type}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, type: e.target.value })
              }
              className="form-input mb-4"
            />
            <input
              type="number"
              value={updatedExpense.amount}
              onChange={(e) =>
                setUpdatedExpense({ ...updatedExpense, amount: e.target.value })
              }
              className="form-input mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleExpenseSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Submit
              </button>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bill Modal */}
      {showBillModal && (
        <div
          className="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBillModal(false);
            }
          }}
        >
          <div
            className="modal-content bg-white p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Bill</h3>
            <input
              type="text"
              value={updatedBill.name}
              onChange={(e) =>
                setUpdatedBill({ ...updatedBill, name: e.target.value })
              }
              className="form-input mb-4"
            />
            <input
              type="text"
              value={updatedBill.dueDate}
              onChange={(e) =>
                setUpdatedBill({ ...updatedBill, dueDate: e.target.value })
              }
              className="form-input mb-4"
            />
            <input
              type="number"
              value={updatedBill.amount}
              onChange={(e) =>
                setUpdatedBill({ ...updatedBill, amount: e.target.value })
              }
              className="form-input mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleBillSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Submit
              </button>
              <button
                onClick={() => setShowBillModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
