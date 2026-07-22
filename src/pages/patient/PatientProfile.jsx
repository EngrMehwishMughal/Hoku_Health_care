import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Edit3,
  HeartPulse,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getPatientProfile,
  updatePatientProfile,
} from "@/services/patientApi";

const initialProfile = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  address: "",
  city: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  allergies: "",
  medicalConditions: "",
};

const inputClassName =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

function readStoredPatient() {
  try {
    const storedPatient =
      localStorage.getItem(
        "patient-user"
      );

    return storedPatient
      ? JSON.parse(storedPatient)
      : {};
  } catch {
    return {};
  }
}

function normalizeDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function normalizeProfile(payload) {
  const profile =
    payload?.patient ||
    payload?.user ||
    payload?.profile ||
    payload?.data?.patient ||
    payload?.data?.user ||
    payload?.data?.profile ||
    payload?.data ||
    payload ||
    {};

  const emergencyContact =
    profile?.emergency_contact ||
    profile?.emergencyContact ||
    {};

  return {
    id: String(
      profile?.id ??
        profile?._id ??
        profile?.patient_id ??
        ""
    ),

    fullName:
      profile?.full_name ??
      profile?.fullName ??
      profile?.name ??
      "",

    email:
      profile?.email ?? "",

    phone:
      profile?.phone ??
      profile?.phone_number ??
      profile?.mobile ??
      "",

    dateOfBirth:
      normalizeDate(
        profile?.date_of_birth ??
          profile?.dateOfBirth ??
          profile?.dob
      ),

    gender:
      profile?.gender ?? "",

    bloodGroup:
      profile?.blood_group ??
      profile?.bloodGroup ??
      "",

    address:
      profile?.address ??
      profile?.street_address ??
      "",

    city:
      profile?.city ?? "",

    emergencyContactName:
      emergencyContact?.name ??
      profile?.emergency_contact_name ??
      profile?.emergencyContactName ??
      "",

    emergencyContactPhone:
      emergencyContact?.phone ??
      emergencyContact?.phone_number ??
      profile?.emergency_contact_phone ??
      profile?.emergencyContactPhone ??
      "",

    allergies: Array.isArray(
      profile?.allergies
    )
      ? profile.allergies.join(", ")
      : profile?.allergies ?? "",

    medicalConditions:
      Array.isArray(
        profile?.medical_conditions
      )
        ? profile.medical_conditions.join(
            ", "
          )
        : profile?.medical_conditions ??
          profile?.medicalConditions ??
          profile?.conditions ??
          "",
  };
}

function getErrorMessage(
  error,
  fallbackMessage
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

function ProfileField({
  label,
  icon: Icon,
  children,
  required = false,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        <span className="inline-flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-slate-400" />
          )}

          {label}

          {required && (
            <span className="text-red-500">
              *
            </span>
          )}
        </span>
      </label>

      {children}
    </div>
  );
}

function ProfileValue({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1E63C6] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function PatientProfile() {
  const [profile, setProfile] =
    useState(initialProfile);

  const [form, setForm] =
    useState(initialProfile);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadProfile =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPatientProfile();

        const normalizedProfile =
          normalizeProfile(response);

        setProfile(normalizedProfile);
        setForm(normalizedProfile);

        localStorage.setItem(
          "patient-user",
          JSON.stringify({
            ...readStoredPatient(),
            ...normalizedProfile,
            name:
              normalizedProfile.fullName,
            fullName:
              normalizedProfile.fullName,
          })
        );
      } catch (loadError) {
        console.error(
          "Patient profile loading error:",
          loadError
        );

        const storedProfile =
          normalizeProfile(
            readStoredPatient()
          );

        setProfile(storedProfile);
        setForm(storedProfile);

        setError(
          "The profile could not be loaded from the server. Your saved local profile is being displayed."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const completionPercentage =
    useMemo(() => {
      const fields = [
        profile.fullName,
        profile.email,
        profile.phone,
        profile.dateOfBirth,
        profile.gender,
        profile.bloodGroup,
        profile.address,
        profile.city,
        profile.emergencyContactName,
        profile.emergencyContactPhone,
      ];

      const completedFields =
        fields.filter(
          (value) =>
            String(value || "").trim()
        ).length;

      return Math.round(
        (completedFields /
          fields.length) *
          100
      );
    }, [profile]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error(
        "Please enter your full name."
      );

      return false;
    }

    if (!form.email.trim()) {
      toast.error(
        "Please enter your email address."
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      toast.error(
        "Please enter a valid email address."
      );

      return false;
    }

    if (
      form.phone.trim() &&
      form.phone.trim().length < 10
    ) {
      toast.error(
        "Please enter a valid phone number."
      );

      return false;
    }

    if (
      form.emergencyContactPhone.trim() &&
      form.emergencyContactPhone.trim()
        .length < 10
    ) {
      toast.error(
        "Please enter a valid emergency contact number."
      );

      return false;
    }

    return true;
  };

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        full_name:
          form.fullName.trim(),

        email: form.email
          .trim()
          .toLowerCase(),

        phone: form.phone.trim(),

        date_of_birth:
          form.dateOfBirth,

        gender: form.gender,

        blood_group:
          form.bloodGroup,

        address:
          form.address.trim(),

        city: form.city.trim(),

        emergency_contact: {
          name:
            form.emergencyContactName.trim(),

          phone:
            form.emergencyContactPhone.trim(),
        },

        allergies:
          form.allergies.trim(),

        medical_conditions:
          form.medicalConditions.trim(),
      };

      const response =
        await updatePatientProfile(
          payload
        );

      const updatedProfile = {
        ...form,
        ...normalizeProfile(response),
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setEditing(false);
      setError("");

      const storedPatient = {
        ...readStoredPatient(),
        ...updatedProfile,
        name:
          updatedProfile.fullName,
        fullName:
          updatedProfile.fullName,
      };

      localStorage.setItem(
        "patient-user",
        JSON.stringify(storedPatient)
      );

      window.dispatchEvent(
        new CustomEvent(
          "patient-profile-updated",
          {
            detail: storedPatient,
          }
        )
      );

      toast.success(
        "Patient profile updated successfully."
      );
    } catch (saveError) {
      console.error(
        "Patient profile update error:",
        saveError
      );

      toast.error(
        getErrorMessage(
          saveError,
          "Unable to update the patient profile."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <section className="flex min-h-[500px] items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#1E63C6]" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading patient profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                Patient account
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Patient profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your personal,
                medical, and emergency
                contact information.
              </p>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] sm:w-auto"
            >
              <Edit3 className="h-4 w-4" />

              Edit Profile
            </button>
          )}
        </div>
      </section>

      {error && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="text-xs leading-5">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadProfile}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />

            Retry
          </button>
        </section>
      )}

      {/* Profile summary */}
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[#1E63C6] text-2xl font-bold text-white">
              {profile.fullName
                ?.trim()
                .charAt(0)
                .toUpperCase() || "P"}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                {profile.fullName ||
                  "Patient"}
              </h2>

              <p className="mt-1 break-words text-sm text-slate-500">
                {profile.email ||
                  "Email not provided"}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />

                Patient account
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Profile completion
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Complete your healthcare
                information.
              </p>
            </div>

            <span className="text-2xl font-bold text-[#1E63C6]">
              {completionPercentage}%
            </span>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#B7CF35] transition-all"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </article>
      </section>

      {editing ? (
        <form
          onSubmit={handleSave}
          className="space-y-6"
        >
          {/* Personal details */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Personal information"
              description="Update your basic identity and contact details."
              icon={UserRound}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField
                label="Full name"
                icon={UserRound}
                required
              >
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter full name"
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="Email address"
                icon={Mail}
                required
              >
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="patient@example.com"
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="Phone number"
                icon={Phone}
              >
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="+92 300 1234567"
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="Date of birth"
                icon={CalendarDays}
              >
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={saving}
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="Gender"
                icon={Users}
              >
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={saving}
                  className={`${inputClassName} appearance-none`}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="other">
                    Other
                  </option>

                  <option value="prefer_not_to_say">
                    Prefer not to say
                  </option>
                </select>
              </ProfileField>

              <ProfileField
                label="Blood group"
                icon={Droplets}
              >
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  disabled={saving}
                  className={`${inputClassName} appearance-none`}
                >
                  <option value="">
                    Select blood group
                  </option>

                  {[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                  ].map((group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  ))}
                </select>
              </ProfileField>

              <ProfileField
                label="Address"
                icon={MapPin}
              >
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter home address"
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="City"
                icon={MapPin}
              >
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter city"
                  className={inputClassName}
                />
              </ProfileField>
            </div>
          </section>

          {/* Medical information */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Medical information"
              description="Add important medical details for healthcare professionals."
              icon={HeartPulse}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ProfileField
                label="Allergies"
                icon={AlertCircle}
              >
                <textarea
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  disabled={saving}
                  rows={4}
                  placeholder="For example: Penicillin, peanuts"
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                />
              </ProfileField>

              <ProfileField
                label="Medical conditions"
                icon={HeartPulse}
              >
                <textarea
                  name="medicalConditions"
                  value={
                    form.medicalConditions
                  }
                  onChange={handleChange}
                  disabled={saving}
                  rows={4}
                  placeholder="For example: Hypertension, diabetes"
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:bg-slate-50"
                />
              </ProfileField>
            </div>
          </section>

          {/* Emergency contact */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Emergency contact"
              description="Provide a trusted contact for emergencies."
              icon={Phone}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <ProfileField
                label="Contact name"
                icon={UserRound}
              >
                <input
                  type="text"
                  name="emergencyContactName"
                  value={
                    form.emergencyContactName
                  }
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Emergency contact name"
                  className={inputClassName}
                />
              </ProfileField>

              <ProfileField
                label="Contact phone"
                icon={Phone}
              >
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={
                    form.emergencyContactPhone
                  }
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="+92 300 1234567"
                  className={inputClassName}
                />
              </ProfileField>
            </div>
          </section>

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />

              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />

                  Saving profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />

                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Personal details view */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Personal information"
              description="Your main patient and contact information."
              icon={UserRound}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ProfileValue
                label="Full name"
                value={profile.fullName}
                icon={UserRound}
              />

              <ProfileValue
                label="Email address"
                value={profile.email}
                icon={Mail}
              />

              <ProfileValue
                label="Phone number"
                value={profile.phone}
                icon={Phone}
              />

              <ProfileValue
                label="Date of birth"
                value={
                  profile.dateOfBirth
                }
                icon={CalendarDays}
              />

              <ProfileValue
                label="Gender"
                value={profile.gender}
                icon={Users}
              />

              <ProfileValue
                label="Blood group"
                value={profile.bloodGroup}
                icon={Droplets}
              />

              <ProfileValue
                label="Address"
                value={profile.address}
                icon={MapPin}
              />

              <ProfileValue
                label="City"
                value={profile.city}
                icon={MapPin}
              />
            </div>
          </section>

          {/* Medical details view */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Medical information"
              description="Important health details for your healthcare team."
              icon={HeartPulse}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <ProfileValue
                label="Allergies"
                value={profile.allergies}
                icon={AlertCircle}
              />

              <ProfileValue
                label="Medical conditions"
                value={
                  profile.medicalConditions
                }
                icon={HeartPulse}
              />
            </div>
          </section>

          {/* Emergency contact view */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              title="Emergency contact"
              description="The person to contact during an emergency."
              icon={Phone}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <ProfileValue
                label="Contact name"
                value={
                  profile.emergencyContactName
                }
                icon={UserRound}
              />

              <ProfileValue
                label="Contact phone"
                value={
                  profile.emergencyContactPhone
                }
                icon={Phone}
              />
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

            <p className="text-xs leading-5 text-emerald-700">
              Keep your profile information
              accurate so healthcare
              professionals can provide
              appropriate support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}