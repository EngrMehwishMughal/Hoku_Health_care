import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CalendarX2,
  CheckCircle2,
  Clock3,
  FileText,
  Hospital,
  LoaderCircle,
  MapPin,
  PhoneCall,
  RefreshCw,
  Search,
  Stethoscope,
  Video,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  cancelPatientAppointment,
  getPatientAppointments,
} from "@/services/patientApi";

const HOKU_PRIMARY = "#1E63C6";

const fallbackAppointments = [
  {
    id: "APT-1001",
    doctor: "Dr. Sarah Ahmed",
    specialty: "Cardiologist",
    date: "2026-07-24",
    time: "10:30 AM",
    consultationType: "clinic",
    location: "HOKU Medical Center",
    reason: "Routine cardiac checkup",
    symptoms: "",
    notes: "",
    status: "confirmed",
    fee: 3500,
  },
  {
    id: "APT-1002",
    doctor: "Dr. Daniel Lee",
    specialty: "General Physician",
    date: "2026-07-29",
    time: "02:00 PM",
    consultationType: "video",
    location: "Online consultation",
    reason: "General health consultation",
    symptoms: "",
    notes: "",
    status: "pending",
    fee: 2500,
  },
  {
    id: "APT-0998",
    doctor: "Dr. Ayesha Khan",
    specialty: "Pediatrician",
    date: "2026-07-15",
    time: "11:00 AM",
    consultationType: "clinic",
    location: "HOKU Medical Center",
    reason: "Child fever and cough",
    symptoms: "Fever and cough",
    notes: "",
    status: "completed",
    fee: 3000,
  },
];

const filters = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "upcoming",
    label: "Upcoming",
  },
  {
    key: "completed",
    label: "Completed",
  },
  {
    key: "cancelled",
    label: "Cancelled",
  },
];

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700",
    icon: CalendarClock,
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700",
    icon: CalendarCheck,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700",
    icon: CalendarX2,
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

function normalizeStatus(value) {
  const status = String(
    value || "pending"
  ).toLowerCase();

  if (
    [
      "confirmed",
      "approved",
      "booked",
      "scheduled",
      "accepted",
    ].includes(status)
  ) {
    return "confirmed";
  }

  if (
    [
      "completed",
      "complete",
      "done",
      "finished",
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

  const specialty =
    doctor?.specialty?.name ??
    doctor?.speciality?.name ??
    doctor?.specialty ??
    doctor?.speciality ??
    appointment?.specialty ??
    appointment?.speciality ??
    appointment?.doctor_specialty ??
    "General Physician";

  return {
    id: String(id),

    doctor:
      doctor?.name ??
      doctor?.full_name ??
      doctor?.fullName ??
      appointment?.doctor_name ??
      appointment?.doctorName ??
      "Healthcare Professional",

    specialty: String(specialty),

    date:
      appointment?.appointment_date ??
      appointment?.appointmentDate ??
      appointment?.scheduled_date ??
      appointment?.date ??
      "",

    time:
      appointment?.appointment_time ??
      appointment?.appointmentTime ??
      appointment?.start_time ??
      appointment?.time ??
      "Time unavailable",

    consultationType:
      normalizeConsultationType(
        appointment?.consultation_type ??
          appointment?.consultationType ??
          appointment?.appointment_type ??
          appointment?.mode
      ),

    location:
      appointment?.location ??
      appointment?.branch?.name ??
      appointment?.clinic_name ??
      appointment?.hospital ??
      doctor?.location ??
      "HOKU Medical Center",

    reason:
      appointment?.reason ??
      appointment?.reason_for_visit ??
      appointment?.description ??
      "Reason not provided",

    symptoms:
      appointment?.symptoms ?? "",

    notes:
      appointment?.notes ??
      appointment?.additional_notes ??
      "",

    status: normalizeStatus(
      appointment?.status
    ),

    fee: Number(
      appointment?.fee ??
        appointment?.consultation_fee ??
        doctor?.fee ??
        doctor?.consultation_fee ??
        0
    ),
  };
}

function formatAppointmentDate(value) {
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
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

function isUpcomingStatus(status) {
  return [
    "confirmed",
    "pending",
  ].includes(status);
}

function StatusBadge({ status }) {
  const config =
    statusConfig[status] ||
    statusConfig.pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1E63C6] shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
        {label}
      </p>
    </article>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
  onViewDetails,
  cancellingId,
}) {
  const consultation =
    consultationConfig[
      appointment.consultationType
    ] || consultationConfig.clinic;

  const ConsultationIcon =
    consultation.icon;

  const canModify =
    isUpcomingStatus(
      appointment.status
    );

  const isCancelling =
    cancellingId === appointment.id;

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:border-[#1E63C6]/20 hover:shadow-md">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <Stethoscope className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {appointment.id}
              </p>

              <h2 className="mt-1 truncate text-base font-bold text-slate-900 sm:text-lg">
                {appointment.doctor}
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#1E63C6]">
                {appointment.specialty}
              </p>
            </div>
          </div>

          <StatusBadge
            status={appointment.status}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            icon={CalendarDays}
            label="Date"
            value={formatAppointmentDate(
              appointment.date
            )}
          />

          <DetailItem
            icon={Clock3}
            label="Time"
            value={appointment.time}
          />

          <DetailItem
            icon={ConsultationIcon}
            label="Consultation"
            value={consultation.label}
          />

          <DetailItem
            icon={MapPin}
            label="Location"
            value={appointment.location}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Reason for appointment
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {appointment.reason}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs text-slate-400">
              Consultation fee
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              PKR{" "}
              {appointment.fee.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={() =>
            onViewDetails(appointment)
          }
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6]"
        >
          <FileText className="h-4 w-4" />

          View Details
        </button>

        {canModify ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/patient/book-appointment?reschedule=${appointment.id}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#1E63C6]/20 bg-[#1E63C6]/5 px-4 text-sm font-semibold text-[#1E63C6] transition hover:bg-[#1E63C6]/10"
            >
              <RefreshCw className="h-4 w-4" />

              Reschedule
            </Link>

            <button
              type="button"
              onClick={() =>
                onCancel(appointment)
              }
              disabled={isCancelling}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}

              {isCancelling
                ? "Cancelling..."
                : "Cancel"}
            </button>
          </div>
        ) : (
          <Link
            to="/patient/book-appointment"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-4 text-sm font-semibold text-white transition hover:bg-[#174FA0]"
          >
            Book Again

            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}

function AppointmentDetailsModal({
  appointment,
  onClose,
}) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose]);

  if (!appointment) {
    return null;
  }

  const consultation =
    consultationConfig[
      appointment.consultationType
    ] || consultationConfig.clinic;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close appointment details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <section className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[26px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1E63C6]">
              {appointment.id}
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Appointment Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl bg-[#1E63C6]/5 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E63C6] text-white">
                <Stethoscope className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  {appointment.doctor}
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#1E63C6]">
                  {appointment.specialty}
                </p>
              </div>
            </div>

            <StatusBadge
              status={appointment.status}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label="Date"
              value={formatAppointmentDate(
                appointment.date
              )}
            />

            <DetailItem
              icon={Clock3}
              label="Time"
              value={appointment.time}
            />

            <DetailItem
              icon={
                consultation.icon
              }
              label="Consultation"
              value={consultation.label}
            />

            <DetailItem
              icon={MapPin}
              label="Location"
              value={appointment.location}
            />
          </div>

          <div className="mt-6 space-y-5 border-t border-slate-100 pt-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Reason
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {appointment.reason}
              </p>
            </div>

            {appointment.symptoms && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Symptoms
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {appointment.symptoms}
                </p>
              </div>
            )}

            {appointment.notes && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Additional Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {appointment.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
              <span className="text-sm text-slate-500">
                Consultation fee
              </span>

              <span className="text-lg font-bold text-slate-900">
                PKR{" "}
                {appointment.fee.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AppointmentHistory() {
  const [
    appointments,
    setAppointments,
  ] = useState([]);

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    cancellingId,
    setCancellingId,
  ] = useState(null);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [usingFallback, setUsingFallback] =
    useState(false);

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        setUsingFallback(false);

        const response =
          await getPatientAppointments({
            page: 1,
            limit: 100,
          });

        const appointmentItems =
          extractArray(response, [
            "appointments",
            "bookings",
            "results",
          ]);

        const normalizedAppointments =
          appointmentItems
            .map(
              normalizeAppointment
            )
            .filter(Boolean);

        setAppointments(
          normalizedAppointments
        );
      } catch (loadError) {
        console.error(
          "Appointment loading error:",
          loadError
        );

        setAppointments(
          fallbackAppointments
        );

        setUsingFallback(true);

        setError(
          "Appointments could not be loaded from the server. Temporary demonstration data is being displayed."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filteredAppointments =
    useMemo(() => {
      const searchValue = searchTerm
        .trim()
        .toLowerCase();

      return appointments.filter(
        (appointment) => {
          const matchesSearch =
            !searchValue ||
            [
              appointment.id,
              appointment.doctor,
              appointment.specialty,
              appointment.location,
              appointment.reason,
              appointment.status,
            ]
              .join(" ")
              .toLowerCase()
              .includes(searchValue);

          let matchesFilter = true;

          if (
            selectedFilter ===
            "upcoming"
          ) {
            matchesFilter =
              isUpcomingStatus(
                appointment.status
              );
          }

          if (
            selectedFilter ===
            "completed"
          ) {
            matchesFilter =
              appointment.status ===
              "completed";
          }

          if (
            selectedFilter ===
            "cancelled"
          ) {
            matchesFilter =
              appointment.status ===
              "cancelled";
          }

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      appointments,
      searchTerm,
      selectedFilter,
    ]);

  const filterCounts = useMemo(
    () => ({
      all: appointments.length,

      upcoming:
        appointments.filter(
          (appointment) =>
            isUpcomingStatus(
              appointment.status
            )
        ).length,

      completed:
        appointments.filter(
          (appointment) =>
            appointment.status ===
            "completed"
        ).length,

      cancelled:
        appointments.filter(
          (appointment) =>
            appointment.status ===
            "cancelled"
        ).length,
    }),
    [appointments]
  );

  const handleCancel = async (
    appointment
  ) => {
    const shouldCancel =
      window.confirm(
        `Cancel your appointment with ${appointment.doctor}?`
      );

    if (!shouldCancel) {
      return;
    }

    try {
      setCancellingId(
        appointment.id
      );

      if (!usingFallback) {
        await cancelPatientAppointment(
          appointment.id
        );
      }

      setAppointments(
        (currentAppointments) =>
          currentAppointments.map(
            (currentAppointment) =>
              currentAppointment.id ===
              appointment.id
                ? {
                    ...currentAppointment,
                    status: "cancelled",
                  }
                : currentAppointment
          )
      );

      setSelectedAppointment(
        (currentAppointment) =>
          currentAppointment?.id ===
          appointment.id
            ? {
                ...currentAppointment,
                status: "cancelled",
              }
            : currentAppointment
      );

      toast.success(
        usingFallback
          ? "Demonstration appointment cancelled locally."
          : "Appointment cancelled successfully."
      );
    } catch (cancelError) {
      console.error(
        "Appointment cancellation error:",
        cancelError
      );

      toast.error(
        cancelError?.message ||
          "Unable to cancel the appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const clearFilters = () => {
    setSelectedFilter("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
              <CalendarCheck className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                Patient appointments
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Appointment history
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review upcoming, completed,
                pending, and cancelled
                healthcare appointments.
              </p>
            </div>
          </div>

          <Link
            to="/patient/book-appointment"
            style={{
              backgroundColor:
                HOKU_PRIMARY,
            }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
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
            onClick={loadAppointments}
            disabled={loading}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Retry
          </button>
        </section>
      )}

      {loading ? (
        <section className="flex min-h-72 items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="text-center">
            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#1E63C6]" />

            <p className="mt-3 text-sm font-semibold text-slate-600">
              Loading appointments...
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Statistics */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard
              label="All Appointments"
              value={filterCounts.all}
              icon={CalendarDays}
              iconClassName="bg-[#1E63C6]/10 text-[#1E63C6]"
            />

            <SummaryCard
              label="Upcoming"
              value={filterCounts.upcoming}
              icon={CalendarClock}
              iconClassName="bg-amber-100 text-amber-700"
            />

            <SummaryCard
              label="Completed"
              value={filterCounts.completed}
              icon={CheckCircle2}
              iconClassName="bg-emerald-100 text-emerald-700"
            />

            <SummaryCard
              label="Cancelled"
              value={filterCounts.cancelled}
              icon={CalendarX2}
              iconClassName="bg-red-100 text-red-700"
            />
          </section>

          {/* Filters */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_1.2fr] lg:items-end">
              <div>
                <label
                  htmlFor="appointment-search"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Search appointments
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="appointment-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Doctor, specialty or appointment ID"
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Filter by status
                  </p>

                  {(selectedFilter !==
                    "all" ||
                    searchTerm) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-[#1E63C6] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
                  {filters.map(
                    (filter) => {
                      const isSelected =
                        selectedFilter ===
                        filter.key;

                      return (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() =>
                            setSelectedFilter(
                              filter.key
                            )
                          }
                          aria-pressed={
                            isSelected
                          }
                          className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#1E63C6] bg-[#1E63C6] text-white"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#1E63C6]/30 hover:text-[#1E63C6]"
                          }`}
                        >
                          {filter.label}

                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-white text-slate-500"
                            }`}
                          >
                            {
                              filterCounts[
                                filter.key
                              ]
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p
                className="text-sm text-slate-500"
                aria-live="polite"
              >
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {
                    filteredAppointments.length
                  }
                </span>{" "}
                {filteredAppointments.length ===
                1
                  ? "appointment"
                  : "appointments"}
              </p>
            </div>

            {filteredAppointments.length >
            0 ? (
              <div className="space-y-5">
                {filteredAppointments.map(
                  (appointment) => (
                    <AppointmentCard
                      key={
                        appointment.id
                      }
                      appointment={
                        appointment
                      }
                      cancellingId={
                        cancellingId
                      }
                      onCancel={
                        handleCancel
                      }
                      onViewDetails={
                        setSelectedAppointment
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
                  <AlertCircle className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                  No appointments found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                  No appointments match
                  your current search and
                  status filters.
                </p>

                {appointments.length >
                0 ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0]"
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <Link
                    to="/patient/book-appointment"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0]"
                  >
                    <CalendarPlus className="h-4 w-4" />

                    Book First Appointment
                  </Link>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={
            selectedAppointment
          }
          onClose={() =>
            setSelectedAppointment(
              null
            )
          }
        />
      )}
    </div>
  );
}