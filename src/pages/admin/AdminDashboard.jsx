import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdPersonAdd, MdDelete, MdEdit, MdAdd } from 'react-icons/md';
import { PropertyContext } from "../../contexts/PropertyContext";
import { AuthContext } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalProperties: 0,
    totalAdmins: 0
  });

  const { user, logout } = useContext(AuthContext);
  const { properties, loading, setLoading } = useContext(PropertyContext);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDashboardData();
  });

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const usersRes = await axios.get(`${API_URL}/admin/users`);
      // Remove withCredentials: true
      
      const usersData = usersRes.data.users || usersRes.data;
      setUsers(usersData);
      
      updateStats(usersData, properties);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Calculate stats
  const updateStats = (usersData, propertiesData) => {
    const totalUsers = usersData.length;
    const totalAgents = usersData.filter(u => u.role === 'agent').length;
    const totalAdmins = usersData.filter(u => u.role === 'admin').length;
    
    setStats({
      totalUsers,
      totalAgents,
      totalProperties: propertiesData.length,
      totalAdmins
    });
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Delete A User
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/admin/${userId}`);
        // Remove withCredentials: true
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  // Toggle User Status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${API_URL}/admin/${userId}`,
        { isActive: !currentStatus }
        // Remove withCredentials: true
      );
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

 

  if (loading) {
    return <div className="p-6"> Loading dashboard... </div>;
  }

//   if (!user) {
//   return <Navigate to="/login" replace />;
// }

  return (
    <section className="space-y-8 pb-8">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            Admin Dashboard
            <span className="text-xs font-normal ml-2 bg-red-100 text-red-800 px-2 py-1 rounded">
              {user?.role}
            </span>
          </h2>
          <p className="text-xs text-gray-500 font-normal"> System administration panel</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/add-property')} className="btn text-nowrap gap-2">
            <MdAdd /> Add Property
          </button>
          <button onClick={handleLogout} className="btn-tertiary">
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white border border-dark/10 py-2 p-4 md:p-6 rounded-lg flex flex-col items-star justify-between">
          <h3 className="text-lg font-semibold flex flex-col">
            Total Users
            <small className="text-xs text-gray-500 font-normal"> Registered users </small>
          </h3>
          <hr className='w-full border-px border-dark/40 my-2' />
          <p className="text-3xl font-extrabold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white border border-dark/10 py-2 p-4 md:p-6 rounded-lg flex flex-col items-start justify-between">
          <h3 className="text-base md:text-lg font-semibold flex flex-col">
            Agents
            <small className="text-xs text-gray-500 font-normal"> Active agents </small>
          </h3>
          <hr className='w-full border-px border-dark/40 my-2'/>
          <p className="text-3xl font-extrabold">{stats.totalAgents}</p>
        </div>

        <div className="bg-white border border-dark/10 py-2 p-4 md:p-6 rounded-lg flex flex-col items-start justify-between">
          <h3 className="text-base md:text-lg font-semibold flex flex-col">
            Properties
            <small className="text-xs text-gray-500 font-normal"> Listed properties</small>
          </h3>
          <hr className='w-full border-px border-dark/40 my-2'/>
          <p className="text-3xl font-extrabold">{stats.totalProperties}</p>
        </div>

        <div className="bg-white border border-dark/10 py-2 p-4 md:p-6 rounded-lg flex flex-col items-start justify-between">
          <h3 className="text-base md:text-lg font-semibold flex flex-col">
            Admins
            <small className="text-xs text-gray-500 font-normal"> System administrators </small>
          </h3>
          <hr className='w-full border-px border-dark/40 my-2'/>
          <p className="text-3xl font-extrabold">{stats.totalAdmins}</p>
        </div>
      </div>

      <div className="w-full">
        {/* Users Management */}
        <div className="bg-white border border-dark/10 rounded-lg shadow-md">
          <div className="p-4 border-b border-dark/40 flex justify-between items-center">
            <h3 className="text-xl font-semibold"> User Management </h3>
            <span className="text-sm text-gray-500"> ({users.length}) users </span>
          </div>
          <div className="divide-y divide-dark/40 max-h-80 overflow-y-auto">
            {users.map((user) => (
              <div key={user._id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold capitalize">{user.username}</h4>
                  <p className="text-gray-600 text-sm lowercase">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'agent' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'active' : 'inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                    className={`px-3 py-1 rounded text-sm cursor-pointer ${
                      user.isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}
                    disabled={user.role === "admin"}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  {/* <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    disabled={user._id === JSON.parse(localStorage.getItem('user')).id}
                  >
                    <MdDelete size={18} />
                  </button> */}
                  <button 
                    onClick={() => handleDeleteUser(user._id || user.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    // disabled={user._id === user?.id || user._id === user?._id}
                    disabled={user.role === "admin"}
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>


        
      </div>
    </section>
  );
};

export default AdminDashboard;