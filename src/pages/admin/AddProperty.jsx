import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const [formData, setFormData] = useState({
    propertyType: '',
    propertyTransaction: '',
    title: '',
    location: '',
    price: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    agentName: '',
    agentNumber: '',
    amenities: [],
    description: '',
    featured: false,
    status: 'active',
    videoUrl: '' // Add this
  });

  const [images, setImages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Available options
  const propertyTypes = ['Apartment', 'Land', 'House'];
  const transactions = ['Sale', 'Rent'];
  const statusOptions = ['active', 'inactive'];
  // const amenityOptions = [
  //   "Wi-Fi", "Lake view", "Free parking", 
  //   "Swimming pool", "Light", "Air conditioning", "Gym",
  //   "Balcony", "Water Heater", "CCTV"
  // ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // const handleAmenityChange = (amenity) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     amenities: prev.amenities.includes(amenity)
  //       ? prev.amenities.filter(a => a !== amenity)
  //       : [...prev.amenities, amenity]
  //   }));
  // };

  // Add these functions with your other handlers
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    
    // Validate number of images
    if (selectedImages.length + images.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    // Validate image types and sizes
    const validImages = selectedImages.filter(image => {
      if (!image.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      if (image.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validImages]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.propertyType || !formData.propertyTransaction || !formData.title || !formData.location || !formData.price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError('Please add at least one image');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        submitData.append('images', image);
      });

      const response = await axios.post(
        `${API_URL}/properties`,
        submitData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Property added successfully!');
      setFormData({
        propertyType: '',
        propertyTransaction: '',
        title: '',
        location: '',
        price: '',
        size: '',
        bedrooms: '',
        bathrooms: '',
        floor: '',
        agentName: '',
        agentNumber: '',
        amenities: [],
        description: '',
        featured: false,
        status: 'active'
      });
      setImages([]);

      // Redirect after success
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error adding property:', error);
      setError(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800"> Add New Property </h1>
            <button onClick={() => navigate('/admin')} className="w-fit btn-tertiary"> Back to Dashboard </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type *
                </label>
                <select
                  name="propertyTransaction"
                  value={formData.propertyTransaction}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Transaction</option>
                  {transactions.map(transaction => (
                    <option key={transaction} value={transaction}>{transaction}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1000 sq ft"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Agent Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter agent name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Number
                </label>
                <input
                  type="text"
                  name="agentNumber"
                  value={formData.agentNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter agent phone number"
                />
              </div>
            </div>

            {/* Amenities - Manual Entry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              
              {/* Input for adding new amenities */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter an amenity (e.g., Fully Equipped Kitchen)"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="btn w-fit"
                >
                  Add Amenity
                </button>
              </div>
              
              {/* Display amenities as chips */}
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the property features, location advantages, etc."
              />
            </div>

            {/* Status & Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Property
                  </span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload up to 10 images. Maximum file size: 5MB each.
              </p>
              
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                          loading='lazy'
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {/* // In your AddProperty component, add this section after the images upload section */}
            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/embed/... or https://vimeo.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported: YouTube, Vimeo, or direct video URLs
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-tertiary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;