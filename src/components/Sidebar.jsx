import { NavLink, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";

import { useAuth } from "../hooks/useAuth";

const links = [
  {
    name: "Dashboard",
    path: "/doctor/dashboard",
    icon: FiHome,
  },
  {
    name: "Appointments",
    path: "/doctor/appointments",
    icon: FiCalendar,
  },
  {
    name: "Patient History",
    path: "/doctor/patients",
    icon: FiUsers,
  },
  {
    name: "Availability",
    path: "/doctor/availability",
    icon: FiClock,
  },
  {
    name: "Profile",
    path: "/doctor/profile",
    icon: FiUser,
  },
  {
    name: "Settings",
    path: "/doctor/settings",
    icon: FiSettings,
  },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/doctor/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col
                    border-r border-[var(--border)] bg-[var(--card)]
                    p-6 shadow-[var(--shadow-soft)]
                    transition-transform duration-300 ease-in-out
                    lg:static lg:translate-x-0 lg:shadow-none ${
                      open
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
      >
        {/* Branding */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center
                       rounded-[var(--radius-lg)] bg-[var(--primary)]
                       text-lg font-bold text-[var(--white)]
                       shadow-[var(--shadow-button)]"
          >
            H
          </div>

          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold text-[var(--heading)]">
              HOKU Health Care
            </p>

            <p className="text-sm text-[var(--muted)]">
              Doctor Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `group flex items-center gap-3
                 rounded-[var(--radius-md)] px-4 py-3
                 text-sm font-medium transition duration-300 ${
                   isActive
                     ? `bg-[var(--primary)]
                        text-[var(--white)]
                        shadow-[var(--shadow-button)]`
                     : `text-[var(--body)]
                        hover:bg-[var(--primary-light)]
                        hover:text-[var(--primary)]`
                 }`
              }
            >
              <Icon
                size={18}
                className="shrink-0"
              />

              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3
                     rounded-[var(--radius-md)] border
                     border-[var(--border)] bg-[var(--card)]
                     px-4 py-3 text-sm font-medium
                     text-[var(--danger)] transition duration-300
                     hover:border-[var(--danger)] hover:bg-[#FEE2E2]"
        >
          <FiLogOut size={18} />

          Logout
        </button>
      </motion.aside>
    </>
  );
}