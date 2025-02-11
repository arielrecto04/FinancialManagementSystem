import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const monthlyData = [
    { month: 'Jan', amount: 65 },
    { month: 'Feb', amount: 59 },
    { month: 'Mar', amount: 80 },
    { month: 'Apr', amount: 81 },
    { month: 'May', amount: 56 },
    { month: 'Jun', amount: 55 },
    { month: 'Jul', amount: 40 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Expense Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <ExpenseSummaryCard title="Daily Expenses" amount="₱0.00" />
        <ExpenseSummaryCard title="Weekly Expenses" amount="₱0.00" />
        <ExpenseSummaryCard title="Monthly Expenses" amount="₱0.00" />
        <ExpenseSummaryCard title="Annual Expenses" amount="₱0.00" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
          <BarChart width={600} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Highest Expense Log</h2>
          {/* Add highest expense content here */}
        </div>
      </div>

      {/* Recent Log */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Log</h2>
        {/* Add recent log content here */}
      </div>
    </div>
  );
};

const ExpenseSummaryCard = ({ title, amount }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold mt-2">{amount}</p>
    <button className="text-sm text-blue-500 mt-2">Update now</button>
  </div>
);

export default Dashboard; 