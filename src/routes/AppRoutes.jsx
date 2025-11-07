import React from 'react';
import { Routes, Route } from "react-router-dom";

// PUBLIC
import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Explore from '../pages/public/Explore';
import Services from '../pages/public/Services';
import PropertyDetail from '../pages/public/PropertyDetail';
import Privacy from '../pages/public/Privacy';
import Terms from '../pages/public/Terms';
import Agents from '../pages/public/Agents';
import Blog from '../pages/public/Blog';
import Careers from '../pages/public/Careers';
import Accessibility from '../pages/public/Accessibility';

// AUTH
import Login from '../pages/auth/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import ResetPassword from '../pages/auth/ResetPassword.jsx';
import VerifyCode from '../pages/auth/VerifyCode.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword';

// USER DASHBOARD
import UserDashboard from '../pages/user/UserDashboard';
import Favorites from '../pages/user/Favorites';

// ADMIN DASHBOARD
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AllProperties from '../pages/admin/AllProperties';
import AllUsers from '../pages/admin/AllUsers';
import AddProperty from '../pages/admin/AddProperty';
import AddAgent from '../pages/admin/AddAgent';
import EditProperty from '../pages/admin/EditProperty';
import Settings from '../pages/admin/Settings';

// ERROR 404
import NotFound from '../pages/NotFound';


const AppRoutes = () => {
  return (
    <div className='font-body bg-light text-dark overflow-x-hidden'>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route index path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/services' element={<Services />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="accessibility" element={<Accessibility />} />
          {/* AUTH */}
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-code' element={<VerifyCode />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        
        
        {/* USER DASHBOARD ROUTES */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute requiredRole="user">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path='favorites' element={<Favorites />} />
          {/* Add more user routes here later */}
        </Route>


        {/* ADMIN DASHBOARD ROUTES */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="add-agent" element={<AddAgent />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="properties" element={<AllProperties />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more admin routes here */}
        </Route>
        


        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default AppRoutes;