import React, { useContext } from 'react';
import { MdPersonAdd, MdDelete, MdEdit, MdAdd } from 'react-icons/md';
import { PropertyContext } from "../../contexts/PropertyContext";
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';



const AllProperties = () => {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { properties, loading, setLoading, getFormattedPrice } = useContext(PropertyContext);


   // Delete A Property
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API_URL}/properties/${propertyId}`);
        // Remove withCredentials: true
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert(error.response?.data?.message || 'Failed to delete property');
      }
    }
  };


  return (
    <section className='pb-8'> 
      All Properties 

      {/* Property Management */}
      <div className="bg-white border border-dark/10 rounded-lg shadow-md my-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold"> Property Management </h3>
          <span className="text-sm text-gray-500"> ({properties.length}) properties</span>
        </div>

        <div className="divide-y  overflow-y-auto">
          {properties.slice(0, 10).map((property) => {
            const priceInfo = getFormattedPrice(property);
            
            return (
              <div key={property._id} className="p-4 flex justify-between items-start group">
                <div className="flex-1">
                  <div className='flex items-start gap-2'>
                    <img src={property.images[0]} className='w-16 h-16 rounded' loading='lazy' />
                    <div>
                      <h4 className="font-semibold">{property.title}</h4>
                      <p className="text-gray-600 text-sm">{property.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">
                      {priceInfo.formatted}{priceInfo.suffix}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {property.propertyType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' :
                      property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                      property.status === 'rented' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <button 
                    onClick={() => navigate(`/admin/edit-property/${property._id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                    title="Edit Property"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProperty(property._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                    title="Delete Property"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default AllProperties;