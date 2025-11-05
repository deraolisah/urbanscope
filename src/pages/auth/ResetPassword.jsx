import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  React.useEffect(() => {
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [resetToken, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        resetToken,
        password: formData.password
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="w-full max-w-md mx-auto mt-12 p-6 text-center">
        <div className="text-red-600">Invalid reset session. Please start over.</div>
        <button 
          onClick={() => navigate('/forgot-password')}
          className="btn mt-4"
        >
          Go to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Password</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
            minLength="6"
          />
        </div>
        
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
            minLength="6"
          />
        </div>

        <button 
          type="submit" 
          className="btn w-full"
          disabled={loading}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>

      <div className="text-center mt-4">
        <button 
          onClick={() => navigate('/login')}
          className="text-dark/80 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;