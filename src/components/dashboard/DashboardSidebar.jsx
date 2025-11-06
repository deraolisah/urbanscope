import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiBarChart,
  FiTruck,
  FiX,
  FiLogOut
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PropertyContext } from '../../contexts/PropertyContext';
import { AuthContext } from '../../contexts/AuthContext';
import { LuChartNoAxesCombined } from "react-icons/lu";
import { BsBuildings } from "react-icons/bs";
import { MdOutlineDomainAdd } from "react-icons/md";
import { useContext } from 'react';

const DashboardSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { properties, loading } = useContext(PropertyContext);


  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LuChartNoAxesCombined
    },
    {
      name: 'Add Agent',
      path: '/admin/add-agent',
      icon: FiUserPlus
    },
    {
      name: 'Add Property',
      path: '/admin/add-property',
      icon: MdOutlineDomainAdd
    },
    {
      name: 'All Properties',
      path: '/admin/properties',
      icon: BsBuildings
    },
    {
      name: 'All Users',
      path: '/admin/users',
      icon: FiUsers
    },
    // {
    //   name: 'Track',
    //   path: '/admin/track',
    //   icon: FiTruck
    // },
    // {
    //   name: 'Reports',
    //   path: '/admin/reports',
    //   icon: FiBarChart
    // },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: FiSettings
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 lg:hidden cursor-pointer"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform
        lg:translate-x-0 bg-white shadow-sm border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="overflow-y-auto py-4 px-3 h-full">
          {/* Close button for mobile */}
          {/* <button
            onClick={onClose}
            className="lg:hidden flex absolute top-40 right-4 p-1 rounded-md text-dark hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button> */}

          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center p-3 text-sm font-medium rounded transition-colors ${
                        isActive(item.path)
                          ? 'bg-dark/10 text-dark'
                          : 'text-gray-700 hover:bg-dark/5'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Stats */}
          <div className="mt-6 p-4 bg-dark/5 rounded-md">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Properties</span>
                <span className="font-medium"> {properties.length} </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600"> Active Properties </span>
                <span className="font-medium"> {properties.filter(p => p.status === 'active').length} </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600"> Added Today</span>
                <span className="font-medium"> {
                  properties.filter(p => {
                    const today = new Date().toDateString();
                    const deliveredDate = new Date(p.deliveryDate).toDateString();
                    return p.status === 'delivered' && deliveredDate === today;
                  }).length
                  }
                </span>
              </div>
            </div>
          </div>


          {/* Logout Button */}
          <button onClick={handleLogout} className='w-full flex items-center mt-2 p-3 text-sm font-medium rounded-lg transition-colors cursor-pointer hover:bg-dark/5'>
            <FiLogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;