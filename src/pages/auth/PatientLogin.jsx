import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

export default function PatientLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Replace this with the patient login API later.
      // await loginPatient(form);

      toast.success("Patient login successful.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--section)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-[32px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            HOKU Health Care
          </p>

          <h1 className="text-3xl font-bold text-[var(--heading)]">
            Patient Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--body)]">
            Sign in to book appointments and manage your healthcare services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="patient@hokuhealth.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <div className="mt-2 text-right">
              <Link
                to="/patient/forgot-password"
                className="text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--body)]">
            New to HOKU?
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <p className="text-center text-sm text-[var(--body)]">
          New patient?{" "}
          <Link
            to="/patient/register"
            className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[var(--body)]">
          Are you a doctor?{" "}
          <Link
            to="/doctor/login"
            className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline"
          >
            Doctor login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}