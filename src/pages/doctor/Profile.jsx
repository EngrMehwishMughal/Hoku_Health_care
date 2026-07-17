import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCamera,
  FiMapPin,
  FiSave,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

import Input from "../../components/Input";
import Button from "../../components/Button";

const initialProfile = {
  name: "Dr. Maya Chen",
  email: "maya@hokuhealth.com",
  phone: "+1 415 555 0198",
  specialty: "Cardiology",
  qualification: "MD, FACC",
  experience: "12",
  fee: "180",
  biography: "Committed to compassionate, evidence-based care.",
  languages: "English, Spanish",
  hospital: "Northwell Medical Center",
  address: "250 Harbor Drive, Suite 300",
};

const defaultProfileImage =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80";

export default function Profile() {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialProfile);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maximumSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > maximumSize) {
      toast.error("Profile image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setProfileImage(defaultProfileImage);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Please enter your email address.");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }

    if (!form.specialty.trim()) {
      toast.error("Please enter your medical specialty.");
      return false;
    }

    if (!form.qualification.trim()) {
      toast.error("Please enter your qualification.");
      return false;
    }

    if (Number(form.experience) < 0) {
      toast.error("Experience cannot be a negative value.");
      return false;
    }

    if (Number(form.fee) < 0) {
      toast.error("Consultation fee cannot be negative.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const profileData = {
        full_name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        specialty: form.specialty.trim(),
        qualification: form.qualification.trim(),
        experience_years: Number(form.experience),
        consultation_fee: Number(form.fee),
        biography: form.biography.trim(),
        languages: form.languages
          .split(",")
          .map((language) => language.trim())
          .filter(Boolean),
        hospital: form.hospital.trim(),
        address: form.address.trim(),
      };

      const multipartData = new FormData();

      multipartData.append(
        "profile",
        new Blob([JSON.stringify(profileData)], {
          type: "application/json",
        })
      );

      if (selectedImageFile) {
        multipartData.append("profile_image", selectedImageFile);
      }

      // Replace with the doctor profile API.
      // await updateDoctorProfile(multipartData);

      console.log("Doctor profile:", profileData);
      console.log("Selected profile image:", selectedImageFile);

      toast.success("Doctor profile updated successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialProfile);
    setProfileImage(defaultProfileImage);
    setSelectedImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.info("Unsaved changes were discarded.");
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="mb-1 text-sm font-semibold text-[var(--primary)]">
          Doctor Portal
        </p>

        <h1 className="text-2xl font-bold text-[var(--heading)] sm:text-3xl">
          Doctor Profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--body)]">
          Update your personal, professional, and clinic information.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
      >
        <div className="flex flex-col gap-8 xl:flex-row">
          <aside className="xl:w-72">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--section)] p-5">
              <div className="relative mx-auto h-32 w-32">
                <img
                  src={profileImage}
                  alt={form.name || "Doctor profile"}
                  className="h-full w-full rounded-full border-4 border-white object-cover shadow-[var(--shadow-soft)]"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[var(--primary)] text-white shadow transition hover:bg-[var(--primary-hover)]"
                  aria-label="Choose profile image"
                >
                  <FiCamera size={17} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />

              <div className="mt-5 text-center">
                <h2 className="font-semibold text-[var(--heading)]">
                  {form.name || "Doctor Name"}
                </h2>

                <p className="mt-1 text-sm text-[var(--body)]">
                  {form.specialty || "Medical Specialist"}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  <FiCamera size={16} />
                  Upload Photo
                </button>

                {selectedImageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--heading)] transition hover:border-red-300 hover:text-red-600"
                  >
                    <FiTrash2 size={16} />
                    Remove Photo
                  </button>
                )}
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-[var(--body)]">
                JPG, PNG, or WebP. Maximum file size: 2 MB.
              </p>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <ProfileSection
              icon={FiUser}
              title="Personal Information"
              description="Basic contact and account details."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
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
                  label="Languages"
                  name="languages"
                  type="text"
                  placeholder="English, Urdu"
                  value={form.languages}
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            <ProfileSection
              icon={FiUser}
              title="Professional Information"
              description="Your clinical background and consultation details."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Medical Specialty"
                  name="specialty"
                  type="text"
                  placeholder="Cardiology"
                  value={form.specialty}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Qualification"
                  name="qualification"
                  type="text"
                  placeholder="MBBS, FCPS"
                  value={form.qualification}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="12"
                  value={form.experience}
                  onChange={handleChange}
                />

                <Input
                  label="Consultation Fee"
                  name="fee"
                  type="number"
                  min="0"
                  placeholder="180"
                  value={form.fee}
                  onChange={handleChange}
                />

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-[var(--heading)]">
                    Professional Biography
                  </span>

                  <textarea
                    name="biography"
                    value={form.biography}
                    onChange={handleChange}
                    placeholder="Describe your professional background and approach to patient care."
                    className="min-h-32 w-full resize-y rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--heading)] outline-none transition placeholder:text-[var(--body)] focus:border-[var(--primary)]"
                  />

                  <p className="mt-2 text-right text-xs text-[var(--body)]">
                    {form.biography.length}/500
                  </p>
                </label>
              </div>
            </ProfileSection>

            <ProfileSection
              icon={FiMapPin}
              title="Clinic Information"
              description="Where patients can visit you for consultations."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Hospital or Clinic"
                  name="hospital"
                  type="text"
                  placeholder="Enter hospital or clinic name"
                  value={form.hospital}
                  onChange={handleChange}
                />

                <Input
                  label="Clinic Address"
                  name="address"
                  type="text"
                  placeholder="Enter complete clinic address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="sm:min-w-32"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
            className="sm:min-w-40"
          >
            <span className="inline-flex items-center gap-2">
              <FiSave size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </span>
          </Button>
        </div>
      </form>
    </motion.main>
  );
}

function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section>
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-2xl bg-[var(--primary-light)] p-2.5 text-[var(--primary)]">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--body)]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}