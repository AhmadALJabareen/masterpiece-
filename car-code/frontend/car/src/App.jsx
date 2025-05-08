import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import MechanicDashboard from './pages/MechanicDashboard';
import ErrorCodeSearch from './pages/ErrorCodeSearch';
import MechanicBooking from './pages/MechanicBooking';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PartsShop from './pages/PartsShop';
function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/mechanic" element={<MechanicDashboard/>} />
        <Route path="/code" element={<ErrorCodeSearch/>} />
        <Route path="/booking" element={<MechanicBooking/>} />
        <Route path="/spare-parts" element={<PartsShop/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
