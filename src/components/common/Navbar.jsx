import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import logo from "@/assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Service", path: "/services" },
    { name: "Specialists", path: "/specialists" },
    { name: "Available", path: "/availability" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact Us", path: "/contact" },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-[15px] font-semibold uppercase tracking-[0.05em]
    transition-colors duration-300 ${
      isActive
        ? "text-[var(--primary)]"
        : "text-[var(--heading)] hover:text-[var(--primary)]"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Logo positioned across both desktop rows */}
        <Link
          to="/"
          onClick={closeMenu}
          className="absolute left-5 top-[34px] z-20 -translate-y-1/2 sm:left-8 lg:left-12 lg:top-1/2"
        >
          <img
            src={logo}
            alt="HOKU Health Care"
            className="h-[58px] w-[145px] object-contain transition-transform duration-300 hover:scale-[1.03] sm:h-[64px] sm:w-[160px] lg:h-[118px] lg:w-[235px]"
          />
        </Link>

        {/* Top information row */}
        <div className="flex min-h-[68px] items-center justify-end lg:pl-[250px]">
          {/* Desktop contact information */}
          <div className="hidden items-stretch lg:flex">
            <ContactItem
              icon={<FaPhoneAlt />}
              text="512-258-789"
              variant="blue"
            />

            <ContactItem
              icon={<FaEnvelope />}
              text="www.hokuhealth.com"
              variant="green"
            />

            <ContactItem
              icon={<FaMapMarkerAlt />}
              text="7537 Wiza Valley, Missouri"
              variant="blue"
            />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)] lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop navigation row */}
        <div className="hidden min-h-[62px] items-center justify-end border-t border-[var(--border)] pl-[250px] lg:flex">
          <nav className="flex items-center gap-9">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={navLinkClass}
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/register"
              className="ml-1 rounded-[7px] bg-[var(--primary)] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.05em] text-white shadow-[var(--shadow-button)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={`overflow-hidden border-t border-[var(--border)] bg-white transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[650px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-5 py-5 sm:px-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--primary-light)] text-[var(--primary)]"
                    : "text-[var(--heading)] hover:bg-[var(--section)] hover:text-[var(--primary)]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/register"
            onClick={closeMenu}
            className="mt-3 rounded-lg bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Get Started
          </Link>

          {/* Mobile contact details */}
          <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-5">
            <MobileContact
              icon={<FaPhoneAlt />}
              text="512-258-789"
            />

            <MobileContact
              icon={<FaEnvelope />}
              text="www.hokuhealth.com"
            />

            <MobileContact
              icon={<FaMapMarkerAlt />}
              text="7537 Wiza Valley, Missouri"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

const ContactItem = ({ icon, text, variant }) => {
  const backgroundClass =
    variant === "green"
      ? "bg-[var(--secondary)]"
      : "bg-[var(--primary)]";

  return (
    <div
      className={`flex min-w-[175px] items-center justify-center gap-2 px-5 py-4 text-white ${backgroundClass}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px]">
        {icon}
      </span>

      <span className="text-[10px] font-semibold uppercase tracking-[0.03em]">
        {text}
      </span>
    </div>
  );
};

const MobileContact = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-[var(--body)]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
};

export default Navbar;