import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import DoctorLayout from "@/layouts/DoctorLayout";
import AdminLayout from "@/layouts/AdminLayout";
import PatientLayout from "@/layouts/PatientLayout";

// Public pages
import Home from "@/pages/HomePage";
import Services from "@/pages/ServicesPage";
import ServiceDetailsPage from "@/pages/ServiceDetailsPage";
import Contact from "@/pages/ContactPage";
import Specialists from "@/pages/SpecialistsPage";

// Authentication pages
import DoctorLogin from "@/pages/auth/DoctorLogin";
import DoctorRegister from "@/pages/auth/DoctorRegister";
import PatientLogin from "@/pages/auth/PatientLogin";
import PatientRegister from "@/pages/auth/PatientRegister";
import AdminLogin from "@/pages/auth/AdminLogin";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Doctor pages
import Dashboard from "@/pages/doctor/Dashboard";
import Appointments from "@/pages/doctor/Appointments";
import PatientHistory from "@/pages/doctor/PatientHistory";
import Availability from "@/pages/doctor/Availability";
import Profile from "@/pages/doctor/Profile";
import Settings from "@/pages/doctor/Settings";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboard";

import DoctorManagement from "@/components/admin/dashboard/DoctorManagement";
import PatientManagement from "@/components/admin/dashboard/PatientManagement";
import AppointmentManagement from "@/components/admin/dashboard/AppointmentManagement";
import ServiceManagement from "@/components/admin/dashboard/ServiceManagement";
import ReminderManagement from "@/components/admin/dashboard/ReminderManagement";
import ReviewManagement from "@/components/admin/dashboard/ReviewManagement";

// Patient pages
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import AppointmentHistory from "@/pages/patient/AppointmentHistory";
import MedicationReminders from "@/pages/patient/MedicationReminder";
import AddReminder from "@/pages/patient/AddReminder";
import SymptomChecker from "@/pages/patient/SymptomChecker";
import AIChatbot from "@/pages/patient/AIChatbot";
import PatientProfile from "@/pages/patient/PatientProfile";

// Protected routes
import AdminProtectedRoute from "./AdminProtectedRoutes";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import PatientProtectedRoute from "./PatientProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================
          Public website
      ========================== */}
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route
          index
          element={<Home />}
        />

        <Route
          path="services"
          element={<Services />}
        />

        <Route
          path="services/:slug"
          element={
            <ServiceDetailsPage />
          }
        />

        <Route
          path="contact"
          element={<Contact />}
        />

        <Route
          path="specialists"
          element={<Specialists />}
        />
      </Route>

      {/* =========================
          Public authentication
      ========================== */}
      <Route
        path="/doctor/login"
        element={<DoctorLogin />}
      />

      <Route
        path="/doctor/register"
        element={<DoctorRegister />}
      />

      <Route
        path="/patient/login"
        element={<PatientLogin />}
      />

      <Route
        path="/patient/register"
        element={<PatientRegister />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* =========================
          Protected Admin portal
      ========================== */}
      <Route
        element={
          <AdminProtectedRoute />
        }
      >
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={
              <AdminDashboardPage />
            }
          />

          <Route
            path="doctors"
            element={
              <DoctorManagement />
            }
          />

          <Route
            path="patients"
            element={
              <PatientManagement />
            }
          />

          <Route
            path="appointments"
            element={
              <AppointmentManagement />
            }
          />

          <Route
            path="services"
            element={
              <ServiceManagement />
            }
          />

          <Route
            path="reminders"
            element={
              <ReminderManagement />
            }
          />

          <Route
            path="reviews"
            element={
              <ReviewManagement />
            }
          />
        </Route>
      </Route>

      {/* =========================
          Protected Doctor portal
      ========================== */}
      <Route
        element={<ProtectedRoute />}
      >
        <Route
          element={
            <RoleRoute
              allowedRoles={[
                "doctor",
              ]}
            />
          }
        >
          <Route
            path="/doctor"
            element={<DoctorLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="appointments"
              element={
                <Appointments />
              }
            />

            <Route
              path="patients"
              element={
                <PatientHistory />
              }
            />

            <Route
              path="availability"
              element={
                <Availability />
              }
            />

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />
          </Route>
        </Route>
      </Route>

      {/* =========================
          Protected Patient portal
      ========================== */}
      <Route
        element={
          <PatientProtectedRoute />
        }
      >
        <Route
          path="/patient"
          element={<PatientLayout />}
        >
          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={
              <PatientDashboard />
            }
          />

          <Route
            path="book-appointment"
            element={
              <BookAppointment />
            }
          />

          <Route
            path="appointment-history"
            element={
              <AppointmentHistory />
            }
          />

          <Route
            path="medication-reminders"
            element={
              <MedicationReminders />
            }
          />

          <Route
            path="medication-reminders/add"
            element={<AddReminder />}
          />

          <Route
            path="symptom-checker"
            element={
              <SymptomChecker />
            }
          />

          <Route
            path="ai-chatbot"
            element={<AIChatbot />}
          />

          <Route
            path="profile"
            element={
              <PatientProfile />
            }
          />
        </Route>
      </Route>

      {/* =========================
          Unknown route
      ========================== */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;