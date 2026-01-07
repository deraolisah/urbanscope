import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      // Example: if you have a favorites endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/favorites`);
      setFavorites(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <section className="container !px-0 md:!px-2">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-0.5">
          Welcome back, <span className='capitalize'> {user?.username} </span>
          {/* <span className="text-sm font-normal ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {user?.role}
          </span> */}
        </h2>
        <button onClick={handleLogout} className="btn-tertiary w-fit">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div onClick={() => navigate('favorites')} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2"> My Favorites </h3>
          <p className="text-3xl font-bold text-blue-600">{favorites.length}</p>
          <p className="text-gray-600"> Saved properties </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2"> Inquiries </h3>
          <p className="text-3xl font-bold text-green-600"> 0 </p>
          <p className="text-gray-600"> Pending inquiries </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2"> Viewed </h3>
          <p className="text-3xl font-bold text-purple-600"> 0 </p>
          <p className="text-gray-600"> Recently viewed </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/explore')}
              className="btn text-left"
            >
              🏠 Browse Properties
            </button>
            <button 
              onClick={() => navigate('favorites')}
              className="btn-secondary text-left"
            >
              ❤️ View My Favorites
            </button>
            <button className="btn-tertiary text-left">
              👤 Edit Profile
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.slice(0, 3).map((fav, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded">
                    <img src={fav.property?.images[0]} alt='' className='' />
                  </div>
                  <div>
                    <p className="font-medium">{fav.property?.title || 'Property'}</p>
                    <p className="text-sm text-gray-600">Added to favorites</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No recent activity</p>
              <button 
                onClick={() => navigate('/explore')}
                className="btn"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;