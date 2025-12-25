import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { PiEyeClosed, PiEye } from "react-icons/pi";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [ showPassword, setShowPassword ] = useState(false);
  
  
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);


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
      if (isLogin) {
        // Use AuthContext login
        const result = await login(formData.email, formData.password);
        
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Use AuthContext register
        const result = await register(formData.username, formData.email, formData.password);
        
        // Redirect after registration (you might want different logic here)
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setError('');
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 p-6 relative text-center overflow-hidden">
      {/* Toggle Buttons */}
      <div className="flex justify-evenly border-b border-gray-300 font-light relative">
        <button 
          onClick={() => { setIsLogin(true); resetForm(); }} 
          className="w-full py-3 cursor-pointer" 
          title='Login'
        >
          Log In
        </button>
        <button 
          onClick={() => { setIsLogin(false); resetForm(); }} 
          className="w-full py-3 cursor-pointer" 
          title='Register'
        >
          Register
        </button>
        <div className={`absolute bottom-0 h-0.5 w-1/2 left-0 bg-dark transition-transform duration-800 ${
            isLogin ? 'translate-x-0' : 'translate-x-full'
          }`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-3 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Forms */}
      <div className="relative h-[320px] mt-6">
        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className={`absolute top-0 left-0 w-full flex flex-col gap-4 transition-all duration-600 ${
            isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
          />
          <div className='relative'>
            <input
              type={!showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 w-full input-field"
              required
            />
            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute top-1/2 -translate-y-1/2 right-2.5 z-2 cursor-pointer text-dark/80 bg-dark/10 w-7 h-7 rounded-full flex items-center justify-center'>
              {showPassword ? (
                <PiEyeClosed className='' />
              ) : (
                <PiEye className='' />
              )}
            </button>
          </div>
          
          <small className="text-left w-full">
            <Link to="/forgot-password" className="text-dark/80 underline">
              forgot your password?
            </Link>
          </small>
          <button 
            type="submit" 
            className="btn mt-2"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className={`absolute top-0 left-0 w-full flex flex-col gap-4 transition-all duration-500 ${
            isLogin ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required={!isLogin}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full input-field"
            required
          />
          <small className="text-left text-dark/80 w-full">
            Already have an account?{' '}
            <span
              onClick={() => { setIsLogin(true); resetForm(); }}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Log in
            </span>
          </small>
          <button 
            type="submit" 
            className="btn mt-2"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;