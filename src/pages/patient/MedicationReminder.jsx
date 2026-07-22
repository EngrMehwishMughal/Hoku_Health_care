import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Clock3,
  Edit3,
  LoaderCircle,
  PauseCircle,
  Pill,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  deleteMedicationReminder,
  getMedicationReminders,
  markMedicationAsTaken,
  updateMedicationReminderStatus,
} from "@/services/patientApi";

const fallbackReminders = [
  {
    id: "MED-1001",
    medicine: "Amlodipine",
    dosage: "5 mg",
    frequency: "Once daily",
    time: "08:00 AM",
    instruction: "Take after breakfast",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    prescribedBy: "Dr. Sarah Ahmed",
    status: "active",
    nextDose: "Today at 08:00 AM",
    lastTaken: "",
  },
  {
    id: "MED-1002",
    medicine: "Vitamin D",
    dosage: "1 tablet",
    frequency: "Once daily",
    time: "01:00 PM",
    instruction: "Take after lunch",
    startDate: "2026-07-05",
    endDate: "2026-09-05",
    prescribedBy: "Dr. Daniel Lee",
    status: "active",
    nextDose: "Today at 01:00 PM",
    lastTaken: "",
  },
  {
    id: "MED-1003",
    medicine: "Metformin",
    dosage: "500 mg",
    frequency: "Twice daily",
    time: "08:30 PM",
    instruction: "Take after dinner",
    startDate: "2026-06-20",
    endDate: "2026-12-20",
    prescribedBy: "Dr. Daniel Lee",
    status: "overdue",
    nextDose: "Overdue by 45 minutes",
    lastTaken: "",
  },
];

const filters = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "overdue",
    label: "Overdue",
  },
  {
    key: "paused",
    label: "Paused",
  },
  {
    key: "completed",
    label: "Completed",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-700",
    icon: BellRing,
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  paused: {
    label: "Paused",
    className:
      "bg-amber-100 text-amber-700",
    icon: PauseCircle,
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
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
    value || "active"
  ).toLowerCase();

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
      "complete",
      "finished",
      "ended",
    ].includes(status)
  ) {
    return "completed";
  }

  if (
    [
      "overdue",
      "missed",
      "late",
    ].includes(status)
  ) {
    return "overdue";
  }

  return "active";
}

function normalizeTime(value) {
  if (!value) {
    return "Time unavailable";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
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

  const reminderTimes =
    reminder?.reminder_times ??
    reminder?.times ??
    reminder?.time;

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

    frequency:
      reminder?.frequency_label ??
      reminder?.frequency ??
      "Frequency not provided",

    time: normalizeTime(
      reminderTimes
    ),

    instruction:
      reminder?.instruction_label ??
      reminder?.instruction ??
      reminder?.instructions ??
      "No additional instruction",

    startDate:
      reminder?.start_date ??
      reminder?.startDate ??
      "",

    endDate:
      reminder?.end_date ??
      reminder?.endDate ??
      "",

    prescribedBy:
      reminder?.prescribed_by ??
      reminder?.prescribedBy ??
      reminder?.doctor_name ??
      "Not provided",

    status: normalizeStatus(
      reminder?.status ??
        (reminder?.is_active === false
          ? "paused"
          : "active")
    ),

    nextDose:
      reminder?.next_dose ??
      reminder?.nextDose ??
      reminder?.next_reminder ??
      "Schedule available",

    lastTaken:
      reminder?.last_taken ??
      reminder?.lastTaken ??
      "",
  };
}

function formatDate(value) {
  if (!value) {
    return "Not available";
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

function formatDateTime(value) {
  if (!value) {
    return "";
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

function StatusBadge({ status }) {
  const config =
    statusConfig[status] ||
    statusConfig.active;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}

function SummaryCard({
  title,
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
        {title}
      </p>
    </article>
  );
}

function ReminderDetail({
  label,
  value,
  icon: Icon,
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

function ReminderCard({
  reminder,
  processingId,
  processingAction,
  onMarkTaken,
  onToggleStatus,
  onDelete,
}) {
  const isCompleted =
    reminder.status === "completed";

  const isPaused =
    reminder.status === "paused";

  const isOverdue =
    reminder.status === "overdue";

  const isProcessing =
    processingId === reminder.id;

  const isMarkingTaken =
    isProcessing &&
    processingAction === "taken";

  const isChangingStatus =
    isProcessing &&
    processingAction === "status";

  const isDeleting =
    isProcessing &&
    processingAction === "delete";

  return (
    <article
      className={`overflow-hidden rounded-[24px] border bg-white shadow-sm transition hover:shadow-md ${
        isOverdue
          ? "border-red-200"
          : "border-slate-200 hover:border-[#1E63C6]/20"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isOverdue
                  ? "bg-red-100 text-red-600"
                  : isCompleted
                    ? "bg-blue-100 text-blue-600"
                    : "bg-[#B7CF35]/20 text-[#61720E]"
              }`}
            >
              <Pill className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {reminder.id}
              </p>

              <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
                {reminder.medicine}
              </h2>

              <p className="mt-1 text-sm font-semibold text-[#1E63C6]">
                {reminder.dosage}
              </p>
            </div>
          </div>

          <StatusBadge
            status={reminder.status}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReminderDetail
            label="Time"
            value={reminder.time}
            icon={Clock3}
          />

          <ReminderDetail
            label="Frequency"
            value={reminder.frequency}
            icon={BellRing}
          />

          <ReminderDetail
            label="Start date"
            value={formatDate(
              reminder.startDate
            )}
            icon={PlayCircle}
          />

          <ReminderDetail
            label="End date"
            value={formatDate(
              reminder.endDate
            )}
            icon={CheckCircle2}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Instructions
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {reminder.instruction}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Prescribed by
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
              {reminder.prescribedBy}
            </p>
          </div>
        </div>

        <div
          className={`mt-5 flex items-start gap-3 rounded-2xl px-4 py-3 ${
            isOverdue
              ? "bg-red-50 text-red-700"
              : isCompleted
                ? "bg-blue-50 text-blue-700"
                : isPaused
                  ? "bg-amber-50 text-amber-700"
                  : "bg-[#1E63C6]/5 text-[#1E63C6]"
          }`}
        >
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="text-xs font-bold uppercase tracking-wide">
              Next dose
            </p>

            <p className="mt-1 text-sm font-semibold">
              {reminder.nextDose}
            </p>

            {reminder.lastTaken && (
              <p className="mt-1 text-xs opacity-80">
                Last taken:{" "}
                {formatDateTime(
                  reminder.lastTaken
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {!isCompleted ? (
          <button
            type="button"
            onClick={() =>
              onMarkTaken(reminder)
            }
            disabled={isProcessing}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-4 text-sm font-semibold text-white transition hover:bg-[#174FA0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMarkingTaken ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            {isMarkingTaken
              ? "Updating..."
              : "Mark as Taken"}
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
            <CheckCircle2 className="h-4 w-4" />

            Schedule completed
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:flex">
          {!isCompleted && (
            <button
              type="button"
              onClick={() =>
                onToggleStatus(reminder)
              }
              disabled={isProcessing}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {isChangingStatus ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : isPaused ? (
                <PlayCircle className="h-4 w-4" />
              ) : (
                <PauseCircle className="h-4 w-4" />
              )}

              {isChangingStatus
                ? "Updating"
                : isPaused
                  ? "Resume"
                  : "Pause"}
            </button>
          )}

          <Link
            to={`/patient/medication-reminders/add?edit=${reminder.id}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6] sm:px-4 sm:text-sm"
          >
            <Edit3 className="h-4 w-4" />

            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              onDelete(reminder)
            }
            disabled={isProcessing}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
          >
            {isDeleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {isDeleting
              ? "Deleting"
              : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function MedicationReminders() {
  const [
    reminders,
    setReminders,
  ] = useState([]);

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState("all");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    usingFallback,
    setUsingFallback,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState(null);

  const [
    processingAction,
    setProcessingAction,
  ] = useState("");

  const loadReminders =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        setUsingFallback(false);

        const response =
          await getMedicationReminders({
            page: 1,
            limit: 100,
          });

        const reminderItems =
          extractArray(response, [
            "reminders",
            "medication_reminders",
            "results",
          ]);

        const normalizedReminders =
          reminderItems
            .map(normalizeReminder)
            .filter(Boolean);

        setReminders(
          normalizedReminders
        );
      } catch (loadError) {
        console.error(
          "Medication reminder loading error:",
          loadError
        );

        setReminders(
          fallbackReminders
        );

        setUsingFallback(true);

        setError(
          "Medication reminders could not be loaded from the server. Temporary demonstration data is being displayed."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const filteredReminders =
    useMemo(() => {
      const searchValue = searchTerm
        .trim()
        .toLowerCase();

      return reminders.filter(
        (reminder) => {
          const matchesFilter =
            selectedFilter === "all" ||
            reminder.status ===
              selectedFilter;

          const matchesSearch =
            !searchValue ||
            [
              reminder.id,
              reminder.medicine,
              reminder.dosage,
              reminder.frequency,
              reminder.instruction,
              reminder.prescribedBy,
              reminder.status,
            ]
              .join(" ")
              .toLowerCase()
              .includes(searchValue);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      reminders,
      searchTerm,
      selectedFilter,
    ]);

  const counts = useMemo(
    () => ({
      all: reminders.length,

      active: reminders.filter(
        (reminder) =>
          reminder.status === "active"
      ).length,

      overdue: reminders.filter(
        (reminder) =>
          reminder.status === "overdue"
      ).length,

      paused: reminders.filter(
        (reminder) =>
          reminder.status === "paused"
      ).length,

      completed: reminders.filter(
        (reminder) =>
          reminder.status ===
          "completed"
      ).length,
    }),
    [reminders]
  );

  const startProcessing = (
    reminderId,
    action
  ) => {
    setProcessingId(reminderId);
    setProcessingAction(action);
  };

  const stopProcessing = () => {
    setProcessingId(null);
    setProcessingAction("");
  };

  const handleMarkTaken = async (
    reminder
  ) => {
    try {
      startProcessing(
        reminder.id,
        "taken"
      );

      if (!usingFallback) {
        await markMedicationAsTaken(
          reminder.id
        );
      }

      const takenAt =
        new Date().toISOString();

      setReminders(
        (currentReminders) =>
          currentReminders.map(
            (currentReminder) =>
              currentReminder.id ===
              reminder.id
                ? {
                    ...currentReminder,
                    status:
                      currentReminder.status ===
                      "overdue"
                        ? "active"
                        : currentReminder.status,

                    lastTaken: takenAt,

                    nextDose:
                      "Dose marked as taken",
                  }
                : currentReminder
          )
      );

      toast.success(
        usingFallback
          ? `${reminder.medicine} was marked as taken locally.`
          : `${reminder.medicine} was marked as taken.`
      );
    } catch (actionError) {
      console.error(
        "Mark medication as taken error:",
        actionError
      );

      toast.error(
        actionError?.message ||
          "Unable to mark the medication as taken."
      );
    } finally {
      stopProcessing();
    }
  };

  const handleToggleStatus = async (
    reminder
  ) => {
    const nextStatus =
      reminder.status === "paused"
        ? "active"
        : "paused";

    try {
      startProcessing(
        reminder.id,
        "status"
      );

      if (!usingFallback) {
        await updateMedicationReminderStatus(
          reminder.id,
          nextStatus
        );
      }

      setReminders(
        (currentReminders) =>
          currentReminders.map(
            (currentReminder) =>
              currentReminder.id ===
              reminder.id
                ? {
                    ...currentReminder,

                    status: nextStatus,

                    nextDose:
                      nextStatus ===
                      "paused"
                        ? "Reminder paused"
                        : `Next reminder at ${currentReminder.time}`,
                  }
                : currentReminder
          )
      );

      toast.success(
        nextStatus === "paused"
          ? "Medication reminder paused."
          : "Medication reminder resumed."
      );
    } catch (actionError) {
      console.error(
        "Reminder status update error:",
        actionError
      );

      toast.error(
        actionError?.message ||
          "Unable to update the reminder status."
      );
    } finally {
      stopProcessing();
    }
  };

  const handleDelete = async (
    reminder
  ) => {
    const shouldDelete =
      window.confirm(
        `Delete the reminder for ${reminder.medicine}?`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      startProcessing(
        reminder.id,
        "delete"
      );

      if (!usingFallback) {
        await deleteMedicationReminder(
          reminder.id
        );
      }

      setReminders(
        (currentReminders) =>
          currentReminders.filter(
            (currentReminder) =>
              currentReminder.id !==
              reminder.id
          )
      );

      toast.success(
        usingFallback
          ? "Demonstration reminder deleted locally."
          : "Medication reminder deleted successfully."
      );
    } catch (actionError) {
      console.error(
        "Reminder deletion error:",
        actionError
      );

      toast.error(
        actionError?.message ||
          "Unable to delete the medication reminder."
      );
    } finally {
      stopProcessing();
    }
  };

  const clearFilters = () => {
    setSelectedFilter("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B7CF35]/20 text-[#61720E]">
              <BellRing className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                Medication management
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Medication reminders
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review medicine schedules,
                track doses, and manage
                active reminders.
              </p>
            </div>
          </div>

          <Link
            to="/patient/medication-reminders/add"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] sm:w-auto"
          >
            <Plus className="h-4 w-4" />

            Add Reminder
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
            onClick={loadReminders}
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
              Loading medication
              reminders...
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Statistics */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard
              title="All Reminders"
              value={counts.all}
              icon={Pill}
              iconClassName="bg-[#1E63C6]/10 text-[#1E63C6]"
            />

            <SummaryCard
              title="Active"
              value={counts.active}
              icon={BellRing}
              iconClassName="bg-emerald-100 text-emerald-700"
            />

            <SummaryCard
              title="Overdue"
              value={counts.overdue}
              icon={AlertCircle}
              iconClassName="bg-red-100 text-red-700"
            />

            <SummaryCard
              title="Completed"
              value={counts.completed}
              icon={CheckCircle2}
              iconClassName="bg-blue-100 text-blue-700"
            />
          </section>

          {/* Filters */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_1.2fr] lg:items-end">
              <div>
                <label
                  htmlFor="reminder-search"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Search reminders
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="reminder-search"
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Medicine, dosage or doctor"
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
                              counts[
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
                    filteredReminders.length
                  }
                </span>{" "}
                {filteredReminders.length ===
                1
                  ? "reminder"
                  : "reminders"}
              </p>
            </div>

            {filteredReminders.length >
            0 ? (
              <div className="space-y-5">
                {filteredReminders.map(
                  (reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      processingId={
                        processingId
                      }
                      processingAction={
                        processingAction
                      }
                      onMarkTaken={
                        handleMarkTaken
                      }
                      onToggleStatus={
                        handleToggleStatus
                      }
                      onDelete={
                        handleDelete
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E63C6]/10 text-[#1E63C6]">
                  <BellRing className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                  No reminders found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                  No medication reminders
                  match the current search
                  and status filters.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {reminders.length >
                    0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6] sm:w-auto"
                    >
                      Clear Filters
                    </button>
                  )}

                  <Link
                    to="/patient/medication-reminders/add"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />

                    Add Reminder
                  </Link>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}