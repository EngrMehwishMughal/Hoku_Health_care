import { useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const ContactForm = ({ compact = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, phone, message } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Replace this temporary delay with your API request later.
      await new Promise((resolve) => setTimeout(resolve, 700));

      toast.success("Your message has been sent successfully.");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--heading)] outline-none transition-all duration-300 placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-light)]";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)] ${
        compact ? "p-6 sm:p-8" : "p-6 sm:p-8 lg:p-10"
      }`}
    >
      <div className="mb-7">
        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
          Send a Message
        </span>

        <h2 className="mt-3 text-3xl font-bold text-[var(--heading)] sm:text-4xl">
          Get in Touch with Our Team
        </h2>

        <p className="mt-3 leading-7 text-[var(--body)]">
          Complete the form and our healthcare team will contact you as soon as
          possible.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[var(--primary)] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;