import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const VerifyCode = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email from location state if available
  React.useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

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

    try {
      const response = await axios.post(`${API_URL}/auth/verify-reset-code`, formData);

      // Navigate to reset password page with the token
      navigate('/reset-password', { state: { resetToken: response.data.resetToken } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setError('Email is required to resend code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email: formData.email });
      setError(''); // Clear any previous errors
      alert('A new code has been sent to your email.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Enter Verification Code</h2>
      <p className="text-gray-600 mb-6 text-center">
        We sent a 6-digit code to your email. Enter it below to reset your password.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            name="code"
            placeholder="Enter 6-digit code"
            value={formData.code}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field text-center text-xl font-mono tracking-widest"
            maxLength="6"
            pattern="[0-9]{6}"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn w-full"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>

      <div className="text-center mt-4 space-y-2">
        <button 
          onClick={handleResendCode}
          className="text-dark/80 hover:underline block w-full"
          disabled={loading}
        >
          Resend Code
        </button>
        <div className="border-t pt-2">
          <button 
            onClick={() => navigate('/login')}
            className="text-dark/80 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;