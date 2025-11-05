import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      setMessage('A verification code has been sent to your email.');
      // Navigate to verify code page after a short delay
      setTimeout(() => {
        navigate('/verify-code', { state: { email } });
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p className="text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>
      
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
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn w-full"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
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

export default ForgotPassword;