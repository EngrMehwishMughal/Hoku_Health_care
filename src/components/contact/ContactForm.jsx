import { useState } from "react";
import { toast } from "react-toastify";

const initialForm = {
  firstName: "",
  secondName: "",
  email: "",
  password: "",
  phone: "",
  service: "",
  message: "",
};

const services = [
  "Home Health",
  "Palliative Care",
  "Hospice Care",
];

const ContactForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.service ||
      !formData.message.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Replace this with the contact API later.
      // await submitContactForm(formData);

      console.log("Contact form:", formData);

      toast.success("Your message has been submitted.");
      setFormData(initialForm);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to submit your message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[510px]"
    >
      <div>
        <p className="text-xl font-medium uppercase tracking-wide text-[#B7CF35]">
          HOKU
        </p>

        <h2 className="mt-1 text-3xl font-extrabold uppercase leading-none text-[#1E63C6] sm:text-4xl">
          Get In Touch
        </h2>
      </div>

      <div className="mt-7 grid gap-x-7 gap-y-5 sm:grid-cols-2">
        <UnderlineInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <UnderlineInput
          label="Second Name"
          name="secondName"
          value={formData.secondName}
          onChange={handleChange}
        />

        <UnderlineInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <UnderlineInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <UnderlineInput
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label className="group block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[#1B1B1F]">
            Service
          </span>

          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full border-0 border-b border-[#4B5563] bg-transparent pb-2 text-sm text-[#1B1B1F] outline-none transition focus:border-[#1E63C6]"
          >
            <option value="">Select</option>

            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[#1B1B1F]">
            Message
          </span>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={2}
            className="min-h-[48px] w-full resize-none border-0 border-b border-[#4B5563] bg-transparent pb-2 text-sm text-[#1B1B1F] outline-none transition focus:border-[#1E63C6]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E63C6] px-6 text-xs font-bold uppercase tracking-wide text-white shadow-[0_5px_12px_rgba(30,99,198,0.35)] transition hover:bg-[#164FA4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Now"}
      </button>
    </form>
  );
};

const UnderlineInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  return (
    <label className="group block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-[#1B1B1F]">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-0 border-b border-[#4B5563] bg-transparent pb-2 text-sm text-[#1B1B1F] outline-none transition focus:border-[#1E63C6]"
      />
    </label>
  );
};

export default ContactForm;