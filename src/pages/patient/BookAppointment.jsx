import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Hospital,
  LoaderCircle,
  MapPin,
  Monitor,
  PhoneCall,
  RefreshCw,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
  createPatientAppointment,
  getDoctorAvailableSlots,
  getPatientDoctors,
  getPatientServices,
} from "@/services/patientApi";

const HOKU_PRIMARY = "#1E63C6";
const HOKU_PRIMARY_DARK = "#174FA0";

const initialForm = {
  service: "",
  doctorId: "",
  appointmentDate: "",
  appointmentTime: "",
  consultationType: "clinic",
  reason: "",
  symptoms: "",
  notes: "",
};

const fallbackServices = [
  {
    id: "general-care",
    name: "General Healthcare",
  },
  {
    id: "cardiology",
    name: "Cardiology",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
  },
  {
    id: "dermatology",
    name: "Dermatology",
  },
  {
    id: "neurology",
    name: "Neurology",
  },
  {
    id: "mental-health",
    name: "Mental Health",
  },
];

const fallbackDoctors = [
  {
    id: "doctor-1",
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    serviceIds: ["cardiology"],
    qualification: "MBBS, FCPS",
    experience: "9 years",
    fee: 3500,
    location: "HOKU Medical Center",
  },
  {
    id: "doctor-2",
    name: "Dr. Daniel Lee",
    specialty: "General Physician",
    serviceIds: ["general-care"],
    qualification: "MBBS, MD",
    experience: "7 years",
    fee: 2500,
    location: "HOKU Health Clinic",
  },
  {
    id: "doctor-3",
    name: "Dr. Ayesha Khan",
    specialty: "Pediatrician",
    serviceIds: ["pediatrics"],
    qualification: "MBBS, FCPS",
    experience: "8 years",
    fee: 3000,
    location: "HOKU Medical Center",
  },
  {
    id: "doctor-4",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    serviceIds: ["dermatology"],
    qualification: "MBBS, MCPS",
    experience: "6 years",
    fee: 2800,
    location: "HOKU Specialist Clinic",
  },
  {
    id: "doctor-5",
    name: "Dr. Omar Farooq",
    specialty: "Neurologist",
    serviceIds: ["neurology"],
    qualification: "MBBS, FCPS",
    experience: "11 years",
    fee: 4000,
    location: "HOKU Medical Center",
  },
  {
    id: "doctor-6",
    name: "Dr. Emily Parker",
    specialty: "Clinical Psychologist",
    serviceIds: ["mental-health"],
    qualification: "PhD Psychology",
    experience: "10 years",
    fee: 3200,
    location: "Online Consultation",
  },
];

const fallbackTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "04:00 PM",
];

const consultationTypes = [
  {
    id: "clinic",
    title: "Clinic Visit",
    description:
      "Visit the doctor at the healthcare facility.",
    icon: Hospital,
  },
  {
    id: "video",
    title: "Video Consultation",
    description:
      "Attend through a secure video consultation.",
    icon: Video,
  },
  {
    id: "phone",
    title: "Phone Consultation",
    description:
      "Receive healthcare guidance through a phone call.",
    icon: PhoneCall,
  },
];

const inputClassName =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

function getLocalDateString(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value) {
  if (!value) {
    return "Not selected";
  }

  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function getErrorMessage(
  error,
  fallback = "Unable to book the appointment."
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function extractArray(
  payload,
  possibleKeys = []
) {
  if (Array.isArray(payload)) {
    return payload;
  }

  for (const key of possibleKeys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (
    Array.isArray(
      payload?.data?.items
    )
  ) {
    return payload.data.items;
  }

  for (const key of possibleKeys) {
    if (
      Array.isArray(
        payload?.data?.[key]
      )
    ) {
      return payload.data[key];
    }
  }

  return [];
}

function normalizeService(service) {
  const id =
    service?.id ??
    service?._id ??
    service?.service_id ??
    service?.slug;

  const name =
    service?.name ??
    service?.title ??
    service?.service_name;

  if (!id || !name) {
    return null;
  }

  return {
    id: String(id),
    name: String(name),
  };
}

function normalizeDoctor(doctor) {
  const id =
    doctor?.id ??
    doctor?._id ??
    doctor?.doctor_id ??
    doctor?.user_id;

  if (!id) {
    return null;
  }

  const rawServices =
    doctor?.services ??
    doctor?.service_ids ??
    doctor?.serviceIds ??
    [];

  const serviceIds = [
    doctor?.service_id,
    doctor?.serviceId,
    doctor?.service?.id,
    doctor?.service?.slug,
    ...(Array.isArray(rawServices)
      ? rawServices.map((service) =>
          typeof service === "object"
            ? service?.id ??
              service?._id ??
              service?.slug
            : service
        )
      : []),
  ]
    .filter(Boolean)
    .map(String);

  const specialtyValue =
    doctor?.specialty?.name ??
    doctor?.speciality?.name ??
    doctor?.specialty ??
    doctor?.speciality ??
    doctor?.department ??
    "General Physician";

  const experienceValue =
    doctor?.experience_years ??
    doctor?.experience ??
    doctor?.years_of_experience;

  return {
    id: String(id),

    name:
      doctor?.name ??
      doctor?.full_name ??
      doctor?.fullName ??
      doctor?.user?.name ??
      doctor?.user?.full_name ??
      "Healthcare Professional",

    specialty:
      String(specialtyValue),

    serviceIds,

    qualification:
      doctor?.qualification ??
      doctor?.qualifications ??
      doctor?.degree ??
      "Qualified healthcare professional",

    experience:
      typeof experienceValue ===
      "number"
        ? `${experienceValue} years`
        : experienceValue ||
          "Experience not provided",

    fee: Number(
      doctor?.fee ??
        doctor?.consultation_fee ??
        doctor?.consultationFee ??
        0
    ),

    location:
      doctor?.location ??
      doctor?.hospital ??
      doctor?.clinic_name ??
      doctor?.branch?.name ??
      "HOKU Medical Center",

    isAvailable:
      doctor?.is_available !== false &&
      doctor?.available !== false &&
      doctor?.status !==
        "unavailable",
  };
}

function normalizeTimeSlots(payload) {
  const slots = extractArray(payload, [
    "slots",
    "available_slots",
    "time_slots",
  ]);

  return slots
    .map((slot) => {
      if (typeof slot === "string") {
        return slot;
      }

      return (
        slot?.time ??
        slot?.start_time ??
        slot?.label ??
        null
      );
    })
    .filter(Boolean);
}

function SectionHeading({
  number,
  title,
  description,
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6] text-sm font-bold text-white">
        {number}
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

function SummaryItem({
  icon: Icon,
  label,
  value,
  supportingText,
}) {
  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>

        {supportingText && (
          <p className="mt-0.5 text-xs text-slate-500">
            {supportingText}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BookAppointment() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [services, setServices] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [timeSlots, setTimeSlots] =
    useState([]);

  const [
    loadingInitialData,
    setLoadingInitialData,
  ] = useState(true);

  const [
    loadingSlots,
    setLoadingSlots,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [formError, setFormError] =
    useState("");

  const [dataNotice, setDataNotice] =
    useState("");

  const minimumDate = useMemo(
    () => getLocalDateString(new Date()),
    []
  );

  const hasDoctorServiceMapping =
    useMemo(
      () =>
        doctors.some(
          (doctor) =>
            doctor.serviceIds.length > 0
        ),
      [doctors]
    );

  const availableDoctors = useMemo(() => {
    if (!form.service) {
      return [];
    }

    const activeDoctors = doctors.filter(
      (doctor) => doctor.isAvailable
    );

    if (!hasDoctorServiceMapping) {
      return activeDoctors;
    }

    return activeDoctors.filter(
      (doctor) =>
        doctor.serviceIds.includes(
          String(form.service)
        )
    );
  }, [
    doctors,
    form.service,
    hasDoctorServiceMapping,
  ]);

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) =>
          doctor.id === form.doctorId
      ) || null,
    [doctors, form.doctorId]
  );

  const selectedService = useMemo(
    () =>
      services.find(
        (service) =>
          service.id === form.service
      ) || null,
    [services, form.service]
  );

  const selectedConsultation =
    useMemo(
      () =>
        consultationTypes.find(
          (item) =>
            item.id ===
            form.consultationType
        ) ||
        consultationTypes[0],
      [form.consultationType]
    );

  const loadBookingData = async () => {
    setLoadingInitialData(true);
    setDataNotice("");

    try {
      const [
        servicesResult,
        doctorsResult,
      ] = await Promise.allSettled([
        getPatientServices({
          page: 1,
          limit: 100,
        }),

        getPatientDoctors({
          page: 1,
          limit: 100,
        }),
      ]);

      let nextServices =
        fallbackServices;

      let nextDoctors =
        fallbackDoctors;

      let fallbackUsed = false;

      if (
        servicesResult.status ===
        "fulfilled"
      ) {
        const serviceItems =
          extractArray(
            servicesResult.value,
            [
              "services",
              "results",
            ]
          )
            .map(normalizeService)
            .filter(Boolean);

        if (serviceItems.length > 0) {
          nextServices =
            serviceItems;
        } else {
          fallbackUsed = true;
        }
      } else {
        fallbackUsed = true;
      }

      if (
        doctorsResult.status ===
        "fulfilled"
      ) {
        const doctorItems =
          extractArray(
            doctorsResult.value,
            [
              "doctors",
              "results",
            ]
          )
            .map(normalizeDoctor)
            .filter(Boolean);

        if (doctorItems.length > 0) {
          nextDoctors =
            doctorItems;
        } else {
          fallbackUsed = true;
        }
      } else {
        fallbackUsed = true;
      }

      setServices(nextServices);
      setDoctors(nextDoctors);

      if (fallbackUsed) {
        setDataNotice(
          "Some booking data could not be loaded from the server. Temporary demonstration data is being displayed."
        );
      }
    } catch (error) {
      setServices(fallbackServices);
      setDoctors(fallbackDoctors);

      setDataNotice(
        "The booking server is currently unavailable. Temporary demonstration data is being displayed."
      );

      console.error(
        "Booking data loading error:",
        error
      );
    } finally {
      setLoadingInitialData(false);
    }
  };

  useEffect(() => {
    loadBookingData();
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadAvailableSlots =
      async () => {
        if (
          !form.doctorId ||
          !form.appointmentDate
        ) {
          setTimeSlots([]);
          return;
        }

        try {
          setLoadingSlots(true);

          const response =
            await getDoctorAvailableSlots(
              form.doctorId,
              form.appointmentDate
            );

          if (!isCurrentRequest) {
            return;
          }

          const normalizedSlots =
            normalizeTimeSlots(
              response
            );

          setTimeSlots(
            normalizedSlots
          );
        } catch (error) {
          if (!isCurrentRequest) {
            return;
          }

          console.error(
            "Available slots loading error:",
            error
          );

          setTimeSlots(
            fallbackTimeSlots
          );

          toast.warning(
            "Live time slots were unavailable. Temporary slots are being displayed."
          );
        } finally {
          if (isCurrentRequest) {
            setLoadingSlots(false);
          }
        }
      };

    loadAvailableSlots();

    return () => {
      isCurrentRequest = false;
    };
  }, [
    form.doctorId,
    form.appointmentDate,
  ]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,

      [name]: value,

      ...(name === "service"
        ? {
            doctorId: "",
            appointmentDate: "",
            appointmentTime: "",
          }
        : {}),

      ...(name === "doctorId"
        ? {
            appointmentDate: "",
            appointmentTime: "",
          }
        : {}),

      ...(name ===
      "appointmentDate"
        ? {
            appointmentTime: "",
          }
        : {}),
    }));

    if (formError) {
      setFormError("");
    }
  };

  const selectConsultationType = (
    type
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      consultationType: type,
    }));

    setFormError("");
  };

  const selectTime = (time) => {
    setForm((currentForm) => ({
      ...currentForm,
      appointmentTime: time,
    }));

    setFormError("");
  };

  const showValidationError = (
    message
  ) => {
    setFormError(message);
    toast.error(message);

    return false;
  };

  const validateForm = () => {
    if (!form.service) {
      return showValidationError(
        "Please select a healthcare service."
      );
    }

    if (!form.doctorId) {
      return showValidationError(
        "Please select a doctor."
      );
    }

    if (!form.appointmentDate) {
      return showValidationError(
        "Please select an appointment date."
      );
    }

    if (!form.appointmentTime) {
      return showValidationError(
        "Please select an appointment time."
      );
    }

    if (!form.reason.trim()) {
      return showValidationError(
        "Please enter the reason for your appointment."
      );
    }

    return true;
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = {
        service_id: form.service,

        service_name:
          selectedService?.name || "",

        doctor_id: form.doctorId,

        doctor_name:
          selectedDoctor?.name || "",

        appointment_date:
          form.appointmentDate,

        appointment_time:
          form.appointmentTime,

        consultation_type:
          form.consultationType,

        reason: form.reason.trim(),

        symptoms:
          form.symptoms.trim(),

        notes: form.notes.trim(),
      };

      await createPatientAppointment(
        payload
      );

      toast.success(
        "Your appointment request has been submitted successfully."
      );

      setForm(initialForm);
      setTimeSlots([]);

      navigate(
        "/patient/appointment-history",
        {
          replace: true,
        }
      );
    } catch (error) {
      const message =
        getErrorMessage(error);

      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page introduction */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                Appointment booking
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Schedule your healthcare
                appointment
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select a service, choose a
                doctor, and reserve a
                suitable appointment time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-[#B7CF35]/15 px-4 py-3">
            <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-[#61720E]" />

            <p className="max-w-xs text-xs leading-5 text-slate-600">
              Appointment requests may
              require confirmation from the
              selected doctor or healthcare
              facility.
            </p>
          </div>
        </div>
      </section>

      {dataNotice && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p className="text-xs leading-5">
              {dataNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookingData}
            disabled={loadingInitialData}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loadingInitialData
                  ? "animate-spin"
                  : ""
              }`}
            />

            Retry
          </button>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          <AlertCircle className="mt-1 h-4 w-4 shrink-0" />

          <span>{formError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]"
      >
        <div className="space-y-6">
          {/* Service and doctor */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="1"
              title="Select service and doctor"
              description="Choose the healthcare service and specialist you need."
            />

            {loadingInitialData ? (
              <div className="flex min-h-36 items-center justify-center gap-3 rounded-2xl bg-slate-50 text-sm text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#1E63C6]" />

                Loading services and
                doctors...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="appointment-service"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Healthcare service

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="appointment-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      disabled={submitting}
                      className={`${inputClassName} appearance-none`}
                    >
                      <option value="">
                        Select a service
                      </option>

                      {services.map(
                        (service) => (
                          <option
                            key={
                              service.id
                            }
                            value={
                              service.id
                            }
                          >
                            {
                              service.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="appointment-doctor"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Select doctor

                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      id="appointment-doctor"
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      disabled={
                        submitting ||
                        !form.service
                      }
                      className={`${inputClassName} appearance-none`}
                    >
                      <option value="">
                        {!form.service
                          ? "Select a service first"
                          : availableDoctors.length ===
                              0
                            ? "No doctors available"
                            : "Select a doctor"}
                      </option>

                      {availableDoctors.map(
                        (doctor) => (
                          <option
                            key={
                              doctor.id
                            }
                            value={
                              doctor.id
                            }
                          >
                            {doctor.name} —{" "}
                            {
                              doctor.specialty
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="mt-5 rounded-2xl border border-[#1E63C6]/15 bg-[#1E63C6]/[0.03] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
                          <Stethoscope className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                            {
                              selectedDoctor.name
                            }
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-[#1E63C6]">
                            {
                              selectedDoctor.specialty
                            }
                          </p>

                          <p className="mt-2 text-xs text-slate-500">
                            {
                              selectedDoctor.qualification
                            }{" "}
                            ·{" "}
                            {
                              selectedDoctor.experience
                            }{" "}
                            experience
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500">
                          Consultation fee
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          PKR{" "}
                          {selectedDoctor.fee.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Consultation type */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="2"
              title="Choose consultation type"
              description="Select how you would like to attend your appointment."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {consultationTypes.map(
                (type) => {
                  const Icon = type.icon;

                  const isSelected =
                    form.consultationType ===
                    type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        selectConsultationType(
                          type.id
                        )
                      }
                      disabled={submitting}
                      aria-pressed={
                        isSelected
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#1E63C6] bg-[#1E63C6]/5 shadow-sm"
                          : "border-slate-200 bg-white hover:border-[#1E63C6]/25 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-[#1E63C6] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-4 text-sm font-bold text-slate-900">
                        {type.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {
                          type.description
                        }
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* Date and time */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="3"
              title="Select date and time"
              description="Choose an available date and appointment slot."
            />

            <div>
              <label
                htmlFor="appointment-date"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Appointment date

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="appointment-date"
                type="date"
                name="appointmentDate"
                value={
                  form.appointmentDate
                }
                onChange={handleChange}
                min={minimumDate}
                disabled={
                  submitting ||
                  !form.doctorId
                }
                className={`${inputClassName} max-w-sm`}
              />

              {!form.doctorId && (
                <p className="mt-2 text-xs text-slate-400">
                  Select a doctor before
                  choosing a date.
                </p>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                Available time

                <span className="ml-1 text-red-500">
                  *
                </span>
              </p>

              {loadingSlots ? (
                <div className="flex min-h-24 items-center justify-center gap-3 rounded-2xl bg-slate-50 text-sm text-slate-500">
                  <LoaderCircle className="h-5 w-5 animate-spin text-[#1E63C6]" />

                  Loading available slots...
                </div>
              ) : !form.appointmentDate ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Select an appointment date
                  to view available times.
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
                  No appointment slots are
                  available for this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {timeSlots.map((time) => {
                    const isSelected =
                      form.appointmentTime ===
                      time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() =>
                          selectTime(time)
                        }
                        disabled={submitting}
                        aria-pressed={
                          isSelected
                        }
                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#1E63C6] bg-[#1E63C6] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6]"
                        }`}
                      >
                        <Clock3 className="h-3.5 w-3.5" />

                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Appointment details */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="4"
              title="Appointment details"
              description="Tell the doctor why you are requesting this appointment."
            />

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="appointment-reason"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Reason for appointment

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="appointment-reason"
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="For example: routine checkup"
                  className={
                    inputClassName
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-symptoms"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Symptoms
                </label>

                <textarea
                  id="appointment-symptoms"
                  name="symptoms"
                  value={form.symptoms}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={4}
                  placeholder="Describe your symptoms, duration, and severity..."
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-notes"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Additional notes
                </label>

                <textarea
                  id="appointment-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  disabled={submitting}
                  rows={3}
                  placeholder="Add any other information for the doctor..."
                  className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Appointment summary */}
        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Appointment Summary
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review your appointment
                  details before submitting.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B7CF35]/20 text-[#61720E]">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              <SummaryItem
                icon={HeartPulse}
                label="Service"
                value={
                  selectedService?.name ||
                  "Not selected"
                }
              />

              <SummaryItem
                icon={UserRound}
                label="Doctor"
                value={
                  selectedDoctor?.name ||
                  "Not selected"
                }
                supportingText={
                  selectedDoctor?.specialty
                }
              />

              <SummaryItem
                icon={CalendarDays}
                label="Date"
                value={formatDisplayDate(
                  form.appointmentDate
                )}
              />

              <SummaryItem
                icon={Clock3}
                label="Time"
                value={
                  form.appointmentTime ||
                  "Not selected"
                }
              />

              <SummaryItem
                icon={
                  selectedConsultation?.icon ||
                  Monitor
                }
                label="Consultation"
                value={
                  selectedConsultation?.title ||
                  "Not selected"
                }
              />

              <SummaryItem
                icon={MapPin}
                label="Location"
                value={
                  form.consultationType ===
                  "video"
                    ? "Online video consultation"
                    : form.consultationType ===
                        "phone"
                      ? "Phone consultation"
                      : selectedDoctor?.location ||
                        "Not selected"
                }
              />
            </div>

            {selectedDoctor && (
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Consultation fee
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    PKR{" "}
                    {selectedDoctor.fee.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                loadingInitialData
              }
              style={{
                backgroundColor:
                  submitting
                    ? HOKU_PRIMARY_DARK
                    : HOKU_PRIMARY,
              }}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1E63C6]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />

                  Submitting request...
                </>
              ) : (
                <>
                  Request Appointment

                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <p className="text-xs leading-5 text-emerald-700">
                You will receive a
                confirmation after your
                appointment request is
                reviewed.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}