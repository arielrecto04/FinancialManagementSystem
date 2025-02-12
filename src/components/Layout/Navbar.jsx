import React from 'react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import NavLink from '@/Components/NavLink';

const Navbar = ({ user }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiBell className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiSettings className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="mt-2">
        {user.role === 'admin' ? (
          <div className="flex space-x-4">
            <NavLink href={route('dashboard')}>Dashboard</NavLink>
            <NavLink href={route('static')}>Static</NavLink>
            <NavLink href={route('expenses')}>Expenses</NavLink>
            <NavLink href={route('transactions')}>Transactions</NavLink>
          </div>
        ) : (
          <div className="flex space-x-4">
            <NavLink href={route('request-form')}>Request Form</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 