import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function PatientRegister() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please complete all required fields.");
      return false;
    }

    if (form.fullName.trim().length < 3) {
      toast.error("Please enter your complete name.");
      return false;
    }

    if (form.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number.");
      return false;
    }

    if (form.password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const patientData = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      };

      // Replace this with your patient registration API.
      // await registerPatient(patientData);

      console.log("Patient registration data:", patientData);

      toast.success("Patient account created successfully.");

      setForm(initialForm);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl rounded-[32px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
      >
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            HOKU Health Care
          </p>

          <h1 className="text-3xl font-bold text-[var(--heading)]">
            Create Patient Account
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--body)]">
            Register to book appointments, manage your healthcare services,
            and view your appointment history.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="patient@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-[var(--body)]">
            By creating an account, you agree to HOKU Health Care’s terms and
            privacy policy.
          </p>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--body)]">
            Already registered?
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <p className="text-center text-sm text-[var(--body)]">
          Already have a patient account?{" "}
          <Link
            to="/patient/login"
            className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[var(--body)]">
          Registering as a healthcare professional?{" "}
          <Link
            to="/doctor/register"
            className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)] hover:underline"
          >
            Doctor registration
          </Link>
        </p>
      </motion.div>
    </div>
  );
}