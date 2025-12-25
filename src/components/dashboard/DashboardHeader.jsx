import React, { useState, useContext } from 'react';
import { FiBell, FiUser, FiLogOut, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { LuChevronDown } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png";
import { AuthContext } from '../../contexts/AuthContext';

const DashboardHeader = ({ isOpen, onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  // const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  // Get admin data from localStorage
  // const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="w-full h-16 border-b border-dark/10 bg-white relative top-0 z-50">
      <div className="px-4 md:px-6 h-full flex items-center justify-between bg-light z-2">
        {/* Left side - Menu button and logo */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user.role === "admin" && (
            <button 
              className="p-2 rounded-md text-dark bg-dark/5 hover:bg-dark/10 lg:hidden cursor-pointer"
              onClick={onMenuClick}
            >
              {!isOpen ? (<FiMenu className="h-5 w-5" />) : (<FiX className="h-5 w-5" />)}
            </button>
          )}

          {/* Logo for mobile */}
          <div className="flex flex-1">
            <Link to="/" onClick={() => { window.scrollTo(0,0); }} className="text-base font-extrabold uppercase flex items-center gap-2"> 
              <img src={logo} alt='UrbanScope Logo' className='h-5 md:h-6' />
            </Link>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-2">
          <button className="p-2.5 rounded bg-dark/10 text-gray-600 hover:bg-gray-100 relative sm:block cursor-pointer">
            <FiBell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
          </button>

          <div className="">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2.5 md:px-1.5 rounded bg-dark/10 hover:bg-dark/15 cursor-pointer"
            >
              <FiUser className="h-4.5 w-4.5" />
              <span className="hidden sm:flex items-center text-sm font-medium text-gray-700 capitalize">
                {user.username || 'Admin'}
                <LuChevronDown className='text-sm mt-0.5' />
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-4 mt-2 min-w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {user.username || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {/* {showMobileSearch && (
        <div className="mt-3 md:hidden">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search shipments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              autoFocus
            />
          </div>
        </div>
      )} */}
    </header>
  );
};

export default DashboardHeader;