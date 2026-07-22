import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  BellRing,
  Bot,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Hospital,
  LoaderCircle,
  MapPin,
  PhoneCall,
  Pill,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getPatientDashboard,
} from "@/services/patientApi";

const fallbackDashboard = {
  statistics: {
    totalAppointments: 5,
    upcomingAppointments: 2,
    activeReminders: 3,
    completedAppointments: 2,
  },

  upcomingAppointments: [
    {
      id: "APT-1001",
      doctor: "Dr. Sarah Ahmed",
      specialty: "Cardiologist",
      date: "2026-07-24",
      time: "10:30 AM",
      consultationType: "clinic",
      location: "HOKU Medical Center",
      status: "confirmed",
    },
    {
      id: "APT-1002",
      doctor: "Dr. Daniel Lee",
      specialty: "General Physician",
      date: "2026-07-29",
      time: "02:00 PM",
      consultationType: "video",
      location: "Online consultation",
      status: "pending",
    },
  ],

  medicationReminders: [
    {
      id: "MED-1001",
      medicine: "Amlodipine",
      dosage: "5 mg",
      time: "08:00 AM",
      instruction: "Take after breakfast",
      status: "active",
    },
    {
      id: "MED-1002",
      medicine: "Vitamin D",
      dosage: "1 tablet",
      time: "01:00 PM",
      instruction: "Take after lunch",
      status: "active",
    },
    {
      id: "MED-1003",
      medicine: "Metformin",
      dosage: "500 mg",
      time: "08:30 PM",
      instruction: "Take after dinner",
      status: "overdue",
    },
  ],

  recentActivity: [
    {
      id: "activity-1",
      title: "Appointment confirmed",
      description:
        "Your appointment with Dr. Sarah Ahmed was confirmed.",
      date: "2026-07-22T10:30:00",
      type: "appointment",
    },
    {
      id: "activity-2",
      title: "Medication reminder created",
      description:
        "A reminder was added for Vitamin D.",
      date: "2026-07-21T14:00:00",
      type: "reminder",
    },
    {
      id: "activity-3",
      title: "Patient profile updated",
      description:
        "Your contact information was updated.",
      date: "2026-07-20T09:15:00",
      type: "profile",
    },
  ],

  healthProfile: {
    bloodGroup: "B+",
    allergies: "No known allergies",
    medicalConditions:
      "No medical conditions provided",
    completionPercentage: 70,
  },
};

const consultationConfig = {
  clinic: {
    label: "Clinic Visit",
    icon: Hospital,
  },

  video: {
    label: "Video Consultation",
    icon: Video,
  },

  phone: {
    label: "Phone Consultation",
    icon: PhoneCall,
  },
};

const appointmentStatusConfig = {
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-100 text-emerald-700",
  },

  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700",
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700",
  },

  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700",
  },
};

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

function normalizeAppointmentStatus(
  value
) {
  const status = String(
    value || "pending"
  ).toLowerCase();

  if (
    [
      "confirmed",
      "approved",
      "accepted",
      "booked",
      "scheduled",
    ].includes(status)
  ) {
    return "confirmed";
  }

  if (
    [
      "completed",
      "complete",
      "finished",
      "done",
    ].includes(status)
  ) {
    return "completed";
  }

  if (
    [
      "cancelled",
      "canceled",
      "rejected",
      "declined",
    ].includes(status)
  ) {
    return "cancelled";
  }

  return "pending";
}

function normalizeConsultationType(
  value
) {
  const type = String(
    value || "clinic"
  ).toLowerCase();

  if (
    type.includes("video") ||
    type.includes("online")
  ) {
    return "video";
  }

  if (
    type.includes("phone") ||
    type.includes("call")
  ) {
    return "phone";
  }

  return "clinic";
}

function normalizeAppointment(
  appointment
) {
  const id =
    appointment?.id ??
    appointment?._id ??
    appointment?.appointment_id ??
    appointment?.booking_id;

  if (!id) {
    return null;
  }

  const doctor =
    appointment?.doctor || {};

  return {
    id: String(id),

    doctor:
      doctor?.name ??
      doctor?.full_name ??
      appointment?.doctor_name ??
      appointment?.doctorName ??
      "Healthcare Professional",

    specialty:
      doctor?.specialty?.name ??
      doctor?.speciality?.name ??
      doctor?.specialty ??
      doctor?.speciality ??
      appointment?.specialty ??
      appointment?.doctor_specialty ??
      "General Physician",

    date:
      appointment?.appointment_date ??
      appointment?.appointmentDate ??
      appointment?.date ??
      "",

    time:
      appointment?.appointment_time ??
      appointment?.appointmentTime ??
      appointment?.time ??
      "Time unavailable",

    consultationType:
      normalizeConsultationType(
        appointment?.consultation_type ??
          appointment?.consultationType ??
          appointment?.mode
      ),

    location:
      appointment?.location ??
      appointment?.branch?.name ??
      appointment?.hospital ??
      doctor?.location ??
      "HOKU Medical Center",

    status:
      normalizeAppointmentStatus(
        appointment?.status
      ),
  };
}

function normalizeReminderStatus(value) {
  const status = String(
    value || "active"
  ).toLowerCase();

  if (
    [
      "overdue",
      "missed",
      "late",
    ].includes(status)
  ) {
    return "overdue";
  }

  if (
    [
      "paused",
      "inactive",
      "disabled",
    ].includes(status)
  ) {
    return "paused";
  }

  if (
    [
      "completed",
      "finished",
      "ended",
    ].includes(status)
  ) {
    return "completed";
  }

  return "active";
}

function normalizeReminder(reminder) {
  const id =
    reminder?.id ??
    reminder?._id ??
    reminder?.reminder_id ??
    reminder?.medication_reminder_id;

  if (!id) {
    return null;
  }

  const rawTimes =
    reminder?.reminder_times ??
    reminder?.times ??
    reminder?.time ??
    reminder?.next_dose;

  return {
    id: String(id),

    medicine:
      reminder?.medicine_name ??
      reminder?.medicine ??
      reminder?.medication_name ??
      reminder?.name ??
      "Medicine",

    dosage:
      reminder?.dosage ??
      reminder?.dose ??
      "Dosage not provided",

    time: Array.isArray(rawTimes)
      ? rawTimes.join(", ")
      : rawTimes ||
        "Time unavailable",

    instruction:
      reminder?.instruction_label ??
      reminder?.instruction ??
      reminder?.instructions ??
      "No special instruction",

    status:
      normalizeReminderStatus(
        reminder?.status ??
          (reminder?.is_active ===
          false
            ? "paused"
            : "active")
      ),
  };
}

function normalizeActivity(activity) {
  const id =
    activity?.id ??
    activity?._id ??
    activity?.activity_id ??
    `${activity?.type || "activity"}-${activity?.created_at || Date.now()}`;

  return {
    id: String(id),

    title:
      activity?.title ??
      activity?.action ??
      activity?.event ??
      "Patient activity",

    description:
      activity?.description ??
      activity?.message ??
      activity?.details ??
      "",

    date:
      activity?.created_at ??
      activity?.createdAt ??
      activity?.date ??
      new Date().toISOString(),

    type:
      activity?.type ??
      activity?.category ??
      "general",
  };
}

function normalizeStatistics(
  payload,
  appointments,
  reminders
) {
  const statistics =
    payload?.statistics ??
    payload?.stats ??
    payload?.summary ??
    {};

  const upcomingCount =
    appointments.filter(
      (appointment) =>
        [
          "confirmed",
          "pending",
        ].includes(
          appointment.status
        )
    ).length;

  const completedCount =
    appointments.filter(
      (appointment) =>
        appointment.status ===
        "completed"
    ).length;

  const activeReminderCount =
    reminders.filter(
      (reminder) =>
        [
          "active",
          "overdue",
        ].includes(reminder.status)
    ).length;

  return {
    totalAppointments: Number(
      statistics?.total_appointments ??
        statistics?.totalAppointments ??
        statistics?.appointments ??
        appointments.length
    ),

    upcomingAppointments: Number(
      statistics?.upcoming_appointments ??
        statistics?.upcomingAppointments ??
        statistics?.upcoming ??
        upcomingCount
    ),

    activeReminders: Number(
      statistics?.active_reminders ??
        statistics?.activeReminders ??
        statistics?.reminders ??
        activeReminderCount
    ),

    completedAppointments: Number(
      statistics?.completed_appointments ??
        statistics?.completedAppointments ??
        statistics?.completed ??
        completedCount
    ),
  };
}

function calculateLocalCompletion(
  patient
) {
  const fields = [
    patient?.name ??
      patient?.fullName ??
      patient?.full_name,

    patient?.email,

    patient?.phone,

    patient?.dateOfBirth ??
      patient?.date_of_birth,

    patient?.gender,

    patient?.bloodGroup ??
      patient?.blood_group,

    patient?.address,

    patient?.city,
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
}

function normalizeHealthProfile(
  payload
) {
  const storedPatient =
    readStoredPatient();

  const healthProfile =
    payload?.health_profile ??
    payload?.healthProfile ??
    payload?.profile_summary ??
    payload?.patient_profile ??
    {};

  const allergies =
    healthProfile?.allergies ??
    storedPatient?.allergies ??
    "";

  const medicalConditions =
    healthProfile?.medical_conditions ??
    healthProfile?.medicalConditions ??
    storedPatient?.medical_conditions ??
    storedPatient?.medicalConditions ??
    "";

  return {
    bloodGroup:
      healthProfile?.blood_group ??
      healthProfile?.bloodGroup ??
      storedPatient?.blood_group ??
      storedPatient?.bloodGroup ??
      "Not provided",

    allergies: Array.isArray(
      allergies
    )
      ? allergies.join(", ")
      : allergies ||
        "No allergies provided",

    medicalConditions:
      Array.isArray(
        medicalConditions
      )
        ? medicalConditions.join(", ")
        : medicalConditions ||
          "No medical conditions provided",

    completionPercentage: Number(
      healthProfile?.completion_percentage ??
        healthProfile?.completionPercentage ??
        storedPatient?.completionPercentage ??
        calculateLocalCompletion(
          storedPatient
        )
    ),
  };
}

function normalizeDashboard(payload) {
  const root =
    payload?.dashboard ??
    payload?.data?.dashboard ??
    payload?.data ??
    payload ??
    {};

  const appointmentItems =
    extractArray(root, [
      "upcoming_appointments",
      "upcomingAppointments",
      "appointments",
    ]);

  const reminderItems =
    extractArray(root, [
      "medication_reminders",
      "medicationReminders",
      "reminders",
    ]);

  const activityItems =
    extractArray(root, [
      "recent_activity",
      "recentActivity",
      "activities",
    ]);

  const appointments =
    appointmentItems
      .map(normalizeAppointment)
      .filter(Boolean);

  const reminders =
    reminderItems
      .map(normalizeReminder)
      .filter(Boolean);

  const activities =
    activityItems
      .map(normalizeActivity)
      .filter(Boolean);

  return {
    statistics:
      normalizeStatistics(
        root,
        appointments,
        reminders
      ),

    upcomingAppointments:
      appointments,

    medicationReminders:
      reminders,

    recentActivity: activities,

    healthProfile:
      normalizeHealthProfile(root),
  };
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const normalizedValue =
    String(value).split("T")[0];

  const date = new Date(
    `${normalizedValue}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function formatActivityDate(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  ).format(date);
}

function getPatientName() {
  const patient =
    readStoredPatient();

  return (
    patient?.name ??
    patient?.fullName ??
    patient?.full_name ??
    "Patient"
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  description,
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <h2 className="mt-4 text-sm font-bold text-slate-800">
        {title}
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

function AppointmentCard({
  appointment,
}) {
  const consultation =
    consultationConfig[
      appointment.consultationType
    ] || consultationConfig.clinic;

  const ConsultationIcon =
    consultation.icon;

  const status =
    appointmentStatusConfig[
      appointment.status
    ] ||
    appointmentStatusConfig.pending;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#1E63C6]/25 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6]/10 text-[#1E63C6]">
            <Stethoscope className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {appointment.doctor}
            </h3>

            <p className="mt-1 text-xs font-semibold text-[#1E63C6]">
              {appointment.specialty}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2">
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs text-slate-400">
              Date
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {formatDate(
                appointment.date
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs text-slate-400">
              Time
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {appointment.time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ConsultationIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs text-slate-400">
              Consultation
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {consultation.label}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs text-slate-400">
              Location
            </p>

            <p className="mt-0.5 text-xs font-semibold text-slate-700">
              {appointment.location}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReminderCard({ reminder }) {
  const isOverdue =
    reminder.status === "overdue";

  return (
    <article
      className={`rounded-2xl border p-4 ${
        isOverdue
          ? "border-red-200 bg-red-50/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isOverdue
                ? "bg-red-100 text-red-600"
                : "bg-[#B7CF35]/20 text-[#61720E]"
            }`}
          >
            <Pill className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {reminder.medicine}
            </h3>

            <p className="mt-1 text-xs font-semibold text-[#1E63C6]">
              {reminder.dosage}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
            isOverdue
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isOverdue
            ? "Overdue"
            : "Active"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2.5">
        <Clock3 className="h-4 w-4 text-slate-400" />

        <span className="text-xs font-semibold text-slate-700">
          {reminder.time}
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {reminder.instruction}
      </p>
    </article>
  );
}

function ActivityItem({ activity }) {
  const activityConfig = {
    appointment: {
      icon: CalendarCheck,
      className:
        "bg-[#1E63C6]/10 text-[#1E63C6]",
    },

    reminder: {
      icon: BellRing,
      className:
        "bg-[#B7CF35]/20 text-[#61720E]",
    },

    profile: {
      icon: UserRound,
      className:
        "bg-violet-100 text-violet-700",
    },

    general: {
      icon: Activity,
      className:
        "bg-slate-100 text-slate-600",
    },
  };

  const config =
    activityConfig[activity.type] ||
    activityConfig.general;

  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-slate-800">
          {activity.title}
        </h3>

        {activity.description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {activity.description}
          </p>
        )}

        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
          {formatActivityDate(
            activity.date
          )}
        </p>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const [dashboard, setDashboard] =
    useState(fallbackDashboard);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    usingFallback,
    setUsingFallback,
  ] = useState(false);

  const patientName = useMemo(
    () => getPatientName(),
    []
  );

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        setUsingFallback(false);

        const response =
          await getPatientDashboard();

        const normalizedDashboard =
          normalizeDashboard(response);

        setDashboard(
          normalizedDashboard
        );
      } catch (loadError) {
        console.error(
          "Patient dashboard loading error:",
          loadError
        );

        setDashboard(
          fallbackDashboard
        );

        setUsingFallback(true);

        setError(
          "Dashboard information could not be loaded from the server. Temporary demonstration data is being displayed."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statistics =
    dashboard.statistics;

  const upcomingAppointments =
    dashboard.upcomingAppointments.slice(
      0,
      3
    );

  const medicationReminders =
    dashboard.medicationReminders.slice(
      0,
      3
    );

  const recentActivity =
    dashboard.recentActivity.slice(
      0,
      5
    );

  const profileCompletion =
    Math.min(
      100,
      Math.max(
        0,
        dashboard.healthProfile
          .completionPercentage || 0
      )
    );

  if (loading) {
    return (
      <section className="flex min-h-[500px] items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#1E63C6]" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading patient dashboard...
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-[26px] bg-[#1E63C6] p-6 text-white shadow-sm sm:p-7 lg:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#B7CF35]/20 blur-2xl"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/85">
              <HeartPulse className="h-3.5 w-3.5" />

              Patient dashboard
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back,{" "}
              {patientName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
              Manage appointments,
              medication reminders, health
              information, and HOKU
              healthcare services from one
              secure portal.
            </p>
          </div>

          <Link
            to="/patient/book-appointment"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#B7CF35] px-5 text-sm font-bold text-[#334007] transition hover:bg-[#C7DE4B] sm:w-auto"
          >
            <CalendarPlus className="h-4 w-4" />

            Book Appointment
          </Link>
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
            onClick={loadDashboard}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />

            Retry
          </button>
        </section>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Appointments"
          value={
            statistics.totalAppointments
          }
          icon={CalendarDays}
          iconClassName="bg-[#1E63C6]/10 text-[#1E63C6]"
          description="All healthcare appointments"
        />

        <StatCard
          title="Upcoming"
          value={
            statistics.upcomingAppointments
          }
          icon={CalendarCheck}
          iconClassName="bg-amber-100 text-amber-700"
          description="Pending and confirmed visits"
        />

        <StatCard
          title="Active Reminders"
          value={
            statistics.activeReminders
          }
          icon={BellRing}
          iconClassName="bg-[#B7CF35]/20 text-[#61720E]"
          description="Current medication schedules"
        />

        <StatCard
          title="Completed"
          value={
            statistics.completedAppointments
          }
          icon={CheckCircle2}
          iconClassName="bg-emerald-100 text-emerald-700"
          description="Completed consultations"
        />
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        {/* Upcoming appointments */}
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Appointments
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your next scheduled
                healthcare consultations.
              </p>
            </div>

            <Link
              to="/patient/appointment-history"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E63C6] hover:underline"
            >
              View All

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {upcomingAppointments.length >
          0 ? (
            <div className="mt-5 space-y-4">
              {upcomingAppointments.map(
                (appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={
                      appointment
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-700">
                No upcoming appointments
              </h3>

              <Link
                to="/patient/book-appointment"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1E63C6] hover:underline"
              >
                Book an appointment

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </article>

        {/* Medication reminders */}
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Medication Reminders
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Today’s medicine schedule.
              </p>
            </div>

            <Link
              to="/patient/medication-reminders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E63C6] hover:underline"
            >
              View All

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {medicationReminders.length >
          0 ? (
            <div className="mt-5 space-y-4">
              {medicationReminders.map(
                (reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-10 text-center">
              <Pill className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-700">
                No active reminders
              </h3>

              <Link
                to="/patient/medication-reminders/add"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1E63C6] hover:underline"
              >
                Add medication reminder

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </article>
      </section>

      {/* Quick actions */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Access important patient
            services.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/patient/book-appointment"
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E63C6] text-white">
              <CalendarPlus className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              Book Appointment
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Schedule a consultation with
              a healthcare professional.
            </p>
          </Link>

          <Link
            to="/patient/medication-reminders/add"
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B7CF35]/25 text-[#61720E]">
              <BellRing className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              Add Reminder
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create a medication reminder
              and treatment schedule.
            </p>
          </Link>

          <Link
            to="/patient/symptom-checker"
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Activity className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              Symptom Checker
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Review symptoms through the
              AI-assisted checker.
            </p>
          </Link>

          <Link
            to="/patient/ai-chatbot"
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Bot className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              AI Health Assistant
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ask general healthcare and
              portal-related questions.
            </p>
          </Link>
        </div>
      </section>

      {/* Bottom content */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Recent activity */}
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Recent updates from your
                patient account.
              </p>
            </div>

            <FileText className="h-5 w-5 text-slate-300" />
          </div>

          {recentActivity.length > 0 ? (
            <div className="mt-5 divide-y divide-slate-100">
              {recentActivity.map(
                (activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-10 text-center">
              <Activity className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No recent activity
              </p>
            </div>
          )}
        </article>

        {/* Health profile */}
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Health Profile
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Important patient health
                information.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Profile completion
              </span>

              <span className="text-sm font-bold text-[#1E63C6]">
                {profileCompletion}%
              </span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#B7CF35] transition-all"
                style={{
                  width: `${profileCompletion}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                Blood group
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {
                  dashboard.healthProfile
                    .bloodGroup
                }
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                Allergies
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {
                  dashboard.healthProfile
                    .allergies
                }
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                Medical conditions
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {
                  dashboard.healthProfile
                    .medicalConditions
                }
              </p>
            </div>
          </div>

          <Link
            to="/patient/profile"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#1E63C6]/20 bg-[#1E63C6]/5 px-4 text-sm font-semibold text-[#1E63C6] transition hover:bg-[#1E63C6]/10"
          >
            <UserRound className="h-4 w-4" />

            Manage Profile
          </Link>
        </article>
      </section>

      {usingFallback && (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

          <p className="text-xs leading-5 text-slate-500">
            Demonstration information is
            displayed until the patient
            dashboard endpoint is
            available.
          </p>
        </div>
      )}
    </div>
  );
}