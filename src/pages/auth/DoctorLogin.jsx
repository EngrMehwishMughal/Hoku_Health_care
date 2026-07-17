import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "@/context/AuthContext.jsx";

export default function DoctorLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      navigate("/doctor/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Doctor login failed:", error);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center
                 overflow-hidden bg-[var(--primary-light)] px-4 py-10"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-24 -top-24
                   h-72 w-72 rounded-full bg-[var(--primary)]/10
                   blur-3xl"
      />

      <div
        className="pointer-events-none absolute -bottom-24 -right-24
                   h-72 w-72 rounded-full bg-[var(--secondary)]/20
                   blur-3xl"
      />

      <motion.section
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-md
                   rounded-[32px] border border-[var(--border)]
                   bg-[var(--card)] p-6 shadow-[var(--shadow-card)]
                   sm:p-8"
      >
        {/* Header */}
        <div className="mb-7 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center
                       justify-center rounded-[var(--radius-lg)]
                       bg-[var(--primary)] text-lg font-bold
                       text-[var(--white)]
                       shadow-[var(--shadow-button)]"
          >
            H
          </div>

          <h1 className="font-heading text-2xl font-semibold text-[var(--heading)]">
            Doctor Login
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Access your dashboard securely
          </p>
        </div>

        {/* Login form */}
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="doctor@hokuhealth.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-[var(--body)]">
              <input
                name="rememberMe"
                type="checkbox"
                checked={form.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 cursor-pointer rounded
                           border-[var(--border)]
                           accent-[var(--primary)]"
              />

              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-[var(--primary)]
                         transition duration-300
                         hover:text-[var(--primary-hover)]
                         hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        {/* Registration link */}
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          New doctor?{" "}
          <Link
            to="/doctor/register"
            className="font-semibold text-[var(--primary)]
                       transition duration-300
                       hover:text-[var(--primary-hover)]
                       hover:underline"
          >
            Create account
          </Link>
        </p>
      </motion.section>
    </main>
  );
}