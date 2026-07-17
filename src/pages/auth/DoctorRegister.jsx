import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  specialty: "",
  qualification: "",
  experience: "",
  fee: "",
  hospital: "",
  address: "",
  license: "",
  biography: "",
};

export default function DoctorRegister() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // Replace this temporary delay with your doctor registration API.
      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });

      console.log("Doctor registration payload:", form);

      toast.success(
        "Registration submitted successfully. Please sign in."
      );

      navigate("/doctor/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Doctor registration failed:", error);
      toast.error("Unable to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen items-center justify-center
                 overflow-hidden bg-[var(--primary-light)] px-4 py-10"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-28 -top-28
                   h-80 w-80 rounded-full bg-[var(--primary)]/10
                   blur-3xl"
      />

      <div
        className="pointer-events-none absolute -bottom-28 -right-28
                   h-80 w-80 rounded-full bg-[var(--secondary)]/20
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
        className="relative z-10 w-full max-w-3xl
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
            Doctor Registration
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Join HOKU Health as a verified healthcare professional
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Dr. Maya Chen"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
              disabled={submitting}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="doctor@hokuhealth.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={submitting}
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
              disabled={submitting}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={submitting}
            />

            <Input
              label="Specialty"
              name="specialty"
              type="text"
              placeholder="Cardiology"
              value={form.specialty}
              onChange={handleChange}
              required
              disabled={submitting}
            />

            <Input
              label="Qualification"
              name="qualification"
              type="text"
              placeholder="MBBS, FCPS"
              value={form.qualification}
              onChange={handleChange}
              required
              disabled={submitting}
            />

            <Input
              label="Experience"
              name="experience"
              type="number"
              placeholder="Years of experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              required
              disabled={submitting}
            />

            <Input
              label="Consultation Fee"
              name="fee"
              type="number"
              placeholder="Consultation fee"
              value={form.fee}
              onChange={handleChange}
              min="0"
              required
              disabled={submitting}
            />

            <Input
              label="Hospital Name"
              name="hospital"
              type="text"
              placeholder="Hospital or clinic name"
              value={form.hospital}
              onChange={handleChange}
              required
              disabled={submitting}
            />

            <Input
              label="Clinic Address"
              name="address"
              type="text"
              placeholder="Enter clinic address"
              value={form.address}
              onChange={handleChange}
              autoComplete="street-address"
              required
              disabled={submitting}
            />

            <Input
              label="License Number"
              name="license"
              type="text"
              placeholder="Medical license number"
              value={form.license}
              onChange={handleChange}
              required
              disabled={submitting}
            />

            {/* Biography */}
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-[var(--heading)]">
                Professional Biography
              </span>

              <textarea
                name="biography"
                value={form.biography}
                onChange={handleChange}
                placeholder="Write a brief professional biography..."
                rows={5}
                maxLength={500}
                disabled={submitting}
                className="min-h-28 w-full resize-y
                           rounded-[var(--radius-md)] border
                           border-[var(--border)] bg-[var(--card)]
                           px-4 py-3 text-sm text-[var(--heading)]
                           outline-none transition duration-300
                           placeholder:text-[var(--muted)]
                           focus:border-[var(--primary)]
                           focus:ring-4 focus:ring-[#1E63C6]/15
                           disabled:cursor-not-allowed
                           disabled:bg-[var(--section)]
                           disabled:opacity-70"
              />

              <span className="mt-1 block text-right text-xs text-[var(--muted)]">
                {form.biography.length}/500
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={submitting}
            >
              {submitting
                ? "Creating account..."
                : "Create Account"}
            </Button>

            <p className="text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link
                to="/doctor/login"
                className="font-semibold text-[var(--primary)]
                           transition duration-300
                           hover:text-[var(--primary-hover)]
                           hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.section>
    </main>
  );
}