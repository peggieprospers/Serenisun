import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Dashboard from './pages/Dashboard';
import RescheduleBooking from './pages/RescheduleBooking';
import Guide from './pages/Guide';
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
  path="/bookings/:id/reschedule"
  element={<ProtectedRoute><RescheduleBooking /></ProtectedRoute>}
/>
     <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
     
      </Routes>
    </>
  );
}