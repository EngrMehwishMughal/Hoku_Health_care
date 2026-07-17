import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/HomePage";
import Services from "@/pages/ServicesPage";
import ServiceDetailsPage from "@/pages/ServiceDetailsPage";
import Contact from "@/pages/ContactPage";
import Specialists from "@/pages/SpecialistsPage";

import DoctorLayout from '../layouts/DoctorLayout';
import Dashboard from '../pages/doctor/Dashboard';
import Appointments from '../pages/doctor/Appointments';
import PatientHistory from '../pages/doctor/PatientHistory';
import Availability from '../pages/doctor/Availability';
import Profile from '../pages/doctor/Profile';
import DoctorLogin from '../pages/auth/DoctorLogin';
import DoctorRegister from '../pages/auth/DoctorRegister';
import PatientLogin from '../pages/auth/PatientLogin';
import PatientRegister from '../pages/auth/PatientRegister';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route
  path="/services/:slug"
  element={<ServiceDetailsPage />}
/>
<Route path="/contact" element={<Contact />} />
<Route path="/specialists" element={<Specialists />} />
      </Route>

      <Route path="/" element={<Navigate to="/doctor/login" replace />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['doctor']} />}>
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<Dashboard />} />
            <Route path="/doctor/appointments" element={<Appointments />} />
            <Route path="/doctor/patients" element={<PatientHistory />} />
            <Route path="/doctor/availability" element={<Availability />} />
            <Route path="/doctor/profile" element={<Profile />} />
            <Route path="/doctor/settings" element={<div className="rounded-[28px] border border-border bg-white p-6 shadow-soft">Settings page coming soon.</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;