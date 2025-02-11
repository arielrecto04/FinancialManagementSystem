import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiPieChart, FiDollarSign, FiFileText } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold">ExpenseTracker</span>
        </div>
        
        <nav className="space-y-2">
          <SidebarLink to="/" icon={<FiHome />} label="Dashboard" />
          <SidebarLink to="/statistics" icon={<FiPieChart />} label="Statistics" />
          <SidebarLink to="/expenses" icon={<FiDollarSign />} label="Expenses" />
          <SidebarLink to="/reports" icon={<FiFileText />} label="Reports" />
        </nav>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

export default Sidebar; 