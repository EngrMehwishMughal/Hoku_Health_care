import { useState } from "react";
import dayjs from "dayjs";
import {
  FiBell,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
} from "react-icons/fi";

import { useAuth } from "../hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [dark, setDark] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Doctor";
  const currentDate = dayjs().format("dddd, D MMMM");

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-4
                 border-b border-[var(--border)] bg-white/90 px-4 py-4
                 backdrop-blur-md lg:px-8"
    >
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-[var(--radius-md)] border
                     border-[var(--border)] bg-[var(--card)] p-2
                     text-[var(--heading)] transition duration-300
                     hover:border-[var(--primary)]
                     hover:bg-[var(--primary-light)]
                     hover:text-[var(--primary)] lg:hidden"
        >
          <FiMenu size={18} />
        </button>

        <div className="hidden md:block">
          <p className="text-sm text-[var(--muted)]">
            {currentDate}
          </p>

          <h2 className="font-heading text-lg font-semibold text-[var(--heading)]">
            Welcome back, {firstName}
          </h2>
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Search */}
        <label
          className="hidden items-center gap-2 rounded-[var(--radius-md)]
                     border border-[var(--border)] bg-[var(--section)]
                     px-3 py-2 text-sm text-[var(--muted)]
                     transition duration-300 focus-within:border-[var(--primary)]
                     focus-within:bg-[var(--card)] md:flex"
        >
          <FiSearch
            size={16}
            className="shrink-0 text-[var(--primary)]"
          />

          <input
            type="search"
            className="w-32 bg-transparent text-[var(--heading)]
                       outline-none placeholder:text-[var(--muted)]
                       xl:w-40"
            placeholder="Search"
            aria-label="Search dashboard"
          />
        </label>

        {/* Theme button */}
        <button
          type="button"
          onClick={() => setDark((previous) => !previous)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-[var(--radius-md)] border
                     border-[var(--border)] bg-[var(--card)] p-2.5
                     text-[var(--heading)] transition duration-300
                     hover:border-[var(--primary)]
                     hover:bg-[var(--primary-light)]
                     hover:text-[var(--primary)]"
        >
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notification button */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-[var(--radius-md)] border
                     border-[var(--border)] bg-[var(--card)] p-2.5
                     text-[var(--heading)] transition duration-300
                     hover:border-[var(--primary)]
                     hover:bg-[var(--primary-light)]
                     hover:text-[var(--primary)]"
        >
          <FiBell size={18} />

          <span
            className="absolute right-[7px] top-[6px] h-2.5 w-2.5
                       rounded-full border-2 border-[var(--card)]
                       bg-[var(--danger)]"
          />
        </button>

        {/* Doctor profile */}
        <div
          className="flex items-center gap-3 rounded-[var(--radius-md)]
                     border border-[var(--border)] bg-[var(--card)]
                     px-2 py-1.5 shadow-[var(--shadow-soft)]
                     sm:px-3"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "Doctor"}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center
                         rounded-full bg-[var(--primary-light)]
                         text-sm font-bold uppercase text-[var(--primary)]"
            >
              {firstName.charAt(0)}
            </div>
          )}

          <div className="hidden sm:block">
            <p className="max-w-[150px] truncate text-sm font-semibold text-[var(--heading)]">
              {user?.name || "Doctor"}
            </p>

            <p className="max-w-[150px] truncate text-xs text-[var(--muted)]">
              {user?.specialty || "Healthcare Specialist"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}