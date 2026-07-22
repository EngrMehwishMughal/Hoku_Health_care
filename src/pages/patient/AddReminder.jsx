import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  NotebookPen,
  Pill,
  Plus,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
  createMedicationReminder,
  getMedicationReminderById,
  updateMedicationReminder,
} from "@/services/patientApi";

const HOKU_PRIMARY = "#1E63C6";
const HOKU_PRIMARY_DARK = "#174FA0";

const medicationTypes = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Drops",
  "Inhaler",
  "Cream",
  "Other",
];

const frequencyOptions = [
  {
    value: "once_daily",
    label: "Once daily",
    times: ["08:00"],
  },
  {
    value: "twice_daily",
    label: "Twice daily",
    times: [
      "08:00",
      "20:00",
    ],
  },
  {
    value: "three_times_daily",
    label: "Three times daily",
    times: [
      "08:00",
      "14:00",
      "20:00",
    ],
  },
  {
    value: "every_8_hours",
    label: "Every 8 hours",
    times: [
      "06:00",
      "14:00",
      "22:00",
    ],
  },
];

const instructionOptions = [
  {
    value: "after_meal",
    label: "After meal",
  },
  {
    value: "before_meal",
    label: "Before meal",
  },
  {
    value: "with_meal",
    label: "With meal",
  },
  {
    value: "empty_stomach",
    label: "On an empty stomach",
  },
  {
    value: "no_restriction",
    label: "No meal restriction",
  },
];

const initialForm = {
  medicineName: "",
  medicationType: "Tablet",
  dosage: "",
  frequency: "once_daily",
  startDate: "",
  endDate: "",
  instruction: "after_meal",
  prescribedBy: "",
  notes: "",
  enabled: true,
};

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

function normalizeDateForInput(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function normalizeTimeForInput(value) {
  if (!value) {
    return "";
  }

  const stringValue =
    String(value).trim();

  const twentyFourHourMatch =
    stringValue.match(
      /^(\d{1,2}):(\d{2})/
    );

  if (
    twentyFourHourMatch &&
    !stringValue
      .toLowerCase()
      .includes("am") &&
    !stringValue
      .toLowerCase()
      .includes("pm")
  ) {
    const hours = String(
      Number(
        twentyFourHourMatch[1]
      )
    ).padStart(2, "0");

    return `${hours}:${twentyFourHourMatch[2]}`;
  }

  const twelveHourMatch =
    stringValue.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!twelveHourMatch) {
    return stringValue;
  }

  let hours = Number(
    twelveHourMatch[1]
  );

  const minutes =
    twelveHourMatch[2];

  const period =
    twelveHourMatch[3].toUpperCase();

  if (
    period === "PM" &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    period === "AM" &&
    hours === 12
  ) {
    hours = 0;
  }

  return `${String(hours).padStart(
    2,
    "0"
  )}:${minutes}`;
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

function formatTime(value) {
  if (!value) {
    return "Not selected";
  }

  const [
    hours,
    minutes,
  ] = value.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  ).format(date);
}

function getErrorMessage(
  error,
  fallback =
    "Unable to save medication reminder."
) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function unwrapReminder(payload) {
  return (
    payload?.reminder ||
    payload?.medication_reminder ||
    payload?.data?.reminder ||
    payload?.data
      ?.medication_reminder ||
    payload?.data ||
    payload
  );
}

function findFrequencyValue(
  reminder
) {
  const rawValue =
    reminder?.frequency ??
    reminder?.frequency_value ??
    "";

  const matchingValue =
    frequencyOptions.find(
      (option) =>
        option.value === rawValue
    );

  if (matchingValue) {
    return matchingValue.value;
  }

  const rawLabel = String(
    reminder?.frequency_label ||
      rawValue
  ).toLowerCase();

  const matchingLabel =
    frequencyOptions.find(
      (option) =>
        option.label.toLowerCase() ===
        rawLabel
    );

  return (
    matchingLabel?.value ||
    "once_daily"
  );
}

function findInstructionValue(
  reminder
) {
  const rawValue =
    reminder?.instruction ??
    reminder?.instruction_value ??
    "";

  const matchingValue =
    instructionOptions.find(
      (option) =>
        option.value === rawValue
    );

  if (matchingValue) {
    return matchingValue.value;
  }

  const rawLabel = String(
    reminder?.instruction_label ||
      reminder?.instructions ||
      rawValue
  ).toLowerCase();

  const matchingLabel =
    instructionOptions.find(
      (option) =>
        option.label.toLowerCase() ===
        rawLabel
    );

  return (
    matchingLabel?.value ||
    "after_meal"
  );
}

function getReminderTimes(
  reminder,
  frequency
) {
  const rawTimes =
    reminder?.reminder_times ??
    reminder?.times ??
    reminder?.time ??
    reminder?.reminder_time;

  if (Array.isArray(rawTimes)) {
    const normalizedTimes =
      rawTimes
        .map((time) =>
          normalizeTimeForInput(
            typeof time === "object"
              ? time?.time ??
                  time?.value
              : time
          )
        )
        .filter(Boolean);

    if (
      normalizedTimes.length > 0
    ) {
      return normalizedTimes;
    }
  }

  if (
    typeof rawTimes === "string"
  ) {
    const normalizedTimes =
      rawTimes
        .split(",")
        .map((time) =>
          normalizeTimeForInput(
            time.trim()
          )
        )
        .filter(Boolean);

    if (
      normalizedTimes.length > 0
    ) {
      return normalizedTimes;
    }
  }

  return (
    frequencyOptions.find(
      (option) =>
        option.value === frequency
    )?.times || ["08:00"]
  );
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
      </div>
    </div>
  );
}

export default function AddReminder() {
  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const reminderId =
    searchParams.get("edit");

  const isEditMode =
    Boolean(reminderId);

  const [form, setForm] =
    useState(initialForm);

  const [
    reminderTimes,
    setReminderTimes,
  ] = useState(["08:00"]);

  const [
    loadingReminder,
    setLoadingReminder,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [formError, setFormError] =
    useState("");

  const [loadError, setLoadError] =
    useState("");

  const minimumDate = useMemo(
    () => getLocalDateString(new Date()),
    []
  );

  const selectedFrequency =
    useMemo(
      () =>
        frequencyOptions.find(
          (option) =>
            option.value ===
            form.frequency
        ) || frequencyOptions[0],
      [form.frequency]
    );

  const selectedInstruction =
    useMemo(
      () =>
        instructionOptions.find(
          (option) =>
            option.value ===
            form.instruction
        ) || instructionOptions[0],
      [form.instruction]
    );

  const loadReminder =
    useCallback(async () => {
      if (!reminderId) {
        setForm(initialForm);
        setReminderTimes(["08:00"]);
        setLoadError("");

        return;
      }

      try {
        setLoadingReminder(true);
        setLoadError("");
        setFormError("");

        const response =
          await getMedicationReminderById(
            reminderId
          );

        const reminder =
          unwrapReminder(response);

        if (!reminder) {
          throw new Error(
            "Medication reminder was not found."
          );
        }

        const frequency =
          findFrequencyValue(
            reminder
          );

        const instruction =
          findInstructionValue(
            reminder
          );

        setForm({
          medicineName:
            reminder?.medicine_name ??
            reminder?.medicine ??
            reminder?.medication_name ??
            reminder?.name ??
            "",

          medicationType:
            reminder?.medication_type ??
            reminder?.type ??
            "Tablet",

          dosage:
            reminder?.dosage ??
            reminder?.dose ??
            "",

          frequency,

          startDate:
            normalizeDateForInput(
              reminder?.start_date ??
                reminder?.startDate
            ),

          endDate:
            normalizeDateForInput(
              reminder?.end_date ??
                reminder?.endDate
            ),

          instruction,

          prescribedBy:
            reminder?.prescribed_by ??
            reminder?.prescribedBy ??
            reminder?.doctor_name ??
            "",

          notes:
            reminder?.notes ??
            reminder?.additional_notes ??
            "",

          enabled:
            reminder?.is_active ??
            reminder?.enabled ??
            reminder?.status !==
              "paused",
        });

        setReminderTimes(
          getReminderTimes(
            reminder,
            frequency
          )
        );
      } catch (error) {
        console.error(
          "Medication reminder loading error:",
          error
        );

        setLoadError(
          getErrorMessage(
            error,
            "Unable to load the medication reminder."
          )
        );
      } finally {
        setLoadingReminder(false);
      }
    }, [reminderId]);

  useEffect(() => {
    loadReminder();
  }, [loadReminder]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,

      [name]:
        type === "checkbox"
          ? checked
          : value,

      ...(name === "startDate" &&
      currentForm.endDate &&
      new Date(currentForm.endDate) <
        new Date(value)
        ? {
            endDate: "",
          }
        : {}),
    }));

    setFormError("");
  };

  const handleFrequencyChange = (
    event
  ) => {
    const { value } = event.target;

    const selectedOption =
      frequencyOptions.find(
        (option) =>
          option.value === value
      );

    setForm((currentForm) => ({
      ...currentForm,
      frequency: value,
    }));

    setReminderTimes(
      selectedOption?.times || [
        "08:00",
      ]
    );

    setFormError("");
  };

  const handleTimeChange = (
    index,
    value
  ) => {
    setReminderTimes(
      (currentTimes) =>
        currentTimes.map(
          (time, timeIndex) =>
            timeIndex === index
              ? value
              : time
        )
    );

    setFormError("");
  };

  const addCustomTime = () => {
    setReminderTimes(
      (currentTimes) => [
        ...currentTimes,
        "12:00",
      ]
    );
  };

  const removeTime = (index) => {
    if (
      reminderTimes.length === 1
    ) {
      toast.error(
        "At least one reminder time is required."
      );

      return;
    }

    setReminderTimes(
      (currentTimes) =>
        currentTimes.filter(
          (_, timeIndex) =>
            timeIndex !== index
        )
    );
  };

  const showValidationError = (
    message
  ) => {
    setFormError(message);
    toast.error(message);

    return false;
  };

  const validateForm = () => {
    if (
      !form.medicineName.trim()
    ) {
      return showValidationError(
        "Please enter the medicine name."
      );
    }

    if (!form.dosage.trim()) {
      return showValidationError(
        "Please enter the medicine dosage."
      );
    }

    if (!form.startDate) {
      return showValidationError(
        "Please select a start date."
      );
    }

    if (!form.endDate) {
      return showValidationError(
        "Please select an end date."
      );
    }

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
    ) {
      return showValidationError(
        "End date cannot be earlier than the start date."
      );
    }

    if (
      reminderTimes.length === 0 ||
      reminderTimes.some(
        (time) => !time
      )
    ) {
      return showValidationError(
        "Please select all reminder times."
      );
    }

    const hasDuplicateTimes =
      new Set(reminderTimes).size !==
      reminderTimes.length;

    if (hasDuplicateTimes) {
      return showValidationError(
        "Reminder times cannot be duplicated."
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
        medicine_name:
          form.medicineName.trim(),

        medication_type:
          form.medicationType,

        dosage:
          form.dosage.trim(),

        frequency:
          form.frequency,

        frequency_label:
          selectedFrequency.label,

        reminder_times:
          reminderTimes,

        start_date:
          form.startDate,

        end_date:
          form.endDate,

        instruction:
          form.instruction,

        instruction_label:
          selectedInstruction.label,

        prescribed_by:
          form.prescribedBy.trim(),

        notes:
          form.notes.trim(),

        is_active:
          form.enabled,

        status:
          form.enabled
            ? "active"
            : "paused",
      };

      if (isEditMode) {
        await updateMedicationReminder(
          reminderId,
          payload
        );

        toast.success(
          "Medication reminder updated successfully."
        );
      } else {
        await createMedicationReminder(
          payload
        );

        toast.success(
          "Medication reminder created successfully."
        );
      }

      navigate(
        "/patient/medication-reminders",
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

  const pageDisabled =
    loadingReminder ||
    submitting;

  if (
    loadingReminder &&
    isEditMode
  ) {
    return (
      <section className="flex min-h-[500px] items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#1E63C6]" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading medication reminder...
          </p>
        </div>
      </section>
    );
  }

  if (
    loadError &&
    isEditMode
  ) {
    return (
      <section className="rounded-[24px] border border-red-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Unable to load reminder
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
          {loadError}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadReminder}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E63C6] px-5 text-sm font-semibold text-white transition hover:bg-[#174FA0] sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />

            Retry
          </button>

          <Link
            to="/patient/medication-reminders"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:text-[#1E63C6] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Reminders
          </Link>
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B7CF35]/20 text-[#61720E]">
              <BellRing className="h-6 w-6" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#61720E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7CF35]" />

                Medication management
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {isEditMode
                  ? "Edit medication reminder"
                  : "Add medication reminder"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {isEditMode
                  ? "Update the medicine schedule, reminder times, instructions, and treatment dates."
                  : "Create a medicine schedule with reminder times, instructions, and treatment dates."}
              </p>
            </div>
          </div>

          <Link
            to="/patient/medication-reminders"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[#1E63C6]/30 hover:bg-[#1E63C6]/5 hover:text-[#1E63C6] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Reminders
          </Link>
        </div>
      </section>

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
          {/* Medication details */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="1"
              title="Medication details"
              description="Enter the medicine name, type, and prescribed dosage."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="medicine-name"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Medicine name

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Pill className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="medicine-name"
                    type="text"
                    name="medicineName"
                    value={
                      form.medicineName
                    }
                    onChange={handleChange}
                    disabled={pageDisabled}
                    placeholder="For example: Amlodipine"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="medication-type"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Medication type
                </label>

                <select
                  id="medication-type"
                  name="medicationType"
                  value={
                    form.medicationType
                  }
                  onChange={handleChange}
                  disabled={pageDisabled}
                  className={`${inputClassName} appearance-none`}
                >
                  {medicationTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="medication-dosage"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Dosage

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="medication-dosage"
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  disabled={pageDisabled}
                  placeholder="For example: 5 mg"
                  className={inputClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="prescribed-by"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Prescribed by
                </label>

                <div className="relative">
                  <Stethoscope className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="prescribed-by"
                    type="text"
                    name="prescribedBy"
                    value={
                      form.prescribedBy
                    }
                    onChange={handleChange}
                    disabled={pageDisabled}
                    placeholder="Doctor’s name"
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="2"
              title="Reminder schedule"
              description="Select the frequency and times for your medicine reminders."
            />

            <div>
              <label
                htmlFor="reminder-frequency"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Frequency
              </label>

              <select
                id="reminder-frequency"
                name="frequency"
                value={form.frequency}
                onChange={
                  handleFrequencyChange
                }
                disabled={pageDisabled}
                className={`${inputClassName} appearance-none`}
              >
                {frequencyOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Reminder times

                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Add or adjust the times
                    when notifications should
                    appear.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addCustomTime}
                  disabled={pageDisabled}
                  className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[#1E63C6]/20 bg-[#1E63C6]/5 px-4 text-xs font-semibold text-[#1E63C6] transition hover:bg-[#1E63C6]/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />

                  Add Time
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {reminderTimes.map(
                  (time, index) => (
                    <div
                      key={`reminder-time-${index}`}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          type="time"
                          value={time}
                          onChange={(
                            event
                          ) =>
                            handleTimeChange(
                              index,
                              event.target.value
                            )
                          }
                          disabled={
                            pageDisabled
                          }
                          aria-label={`Reminder time ${
                            index + 1
                          }`}
                          className={`${inputClassName} pl-11`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeTime(index)
                        }
                        disabled={
                          pageDisabled ||
                          reminderTimes.length ===
                            1
                        }
                        aria-label={`Remove reminder time ${
                          index + 1
                        }`}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Treatment dates */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="3"
              title="Treatment dates"
              description="Choose when the medication schedule starts and ends."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reminder-start-date"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Start date

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="reminder-start-date"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={
                    isEditMode
                      ? undefined
                      : minimumDate
                  }
                  disabled={pageDisabled}
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="reminder-end-date"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  End date

                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="reminder-end-date"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={
                    form.startDate ||
                    minimumDate
                  }
                  disabled={pageDisabled}
                  className={inputClassName}
                />
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              number="4"
              title="Medicine instructions"
              description="Add meal instructions and any important medication notes."
            />

            <div>
              <label
                htmlFor="medicine-instruction"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Meal instruction
              </label>

              <select
                id="medicine-instruction"
                name="instruction"
                value={form.instruction}
                onChange={handleChange}
                disabled={pageDisabled}
                className={`${inputClassName} appearance-none`}
              >
                {instructionOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mt-5">
              <label
                htmlFor="reminder-notes"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Additional notes
              </label>

              <div className="relative">
                <NotebookPen className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400" />

                <textarea
                  id="reminder-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  disabled={pageDisabled}
                  rows={4}
                  maxLength={300}
                  placeholder="Add any special instructions or precautions..."
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E63C6] focus:ring-4 focus:ring-[#1E63C6]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
              </div>

              <p className="mt-1.5 text-right text-xs text-slate-400">
                {form.notes.length}/300
              </p>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <input
                type="checkbox"
                name="enabled"
                checked={form.enabled}
                onChange={handleChange}
                disabled={pageDisabled}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#1E63C6]"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Enable reminder
                  notifications
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Keep this reminder active
                  after it is saved.
                </span>
              </span>
            </label>
          </section>
        </div>

        {/* Summary */}
        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Reminder Summary
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review the medication
                  schedule before saving it.
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B7CF35]/20 text-[#61720E]">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              <SummaryItem
                icon={Pill}
                label="Medicine"
                value={
                  form.medicineName.trim() ||
                  "Not entered"
                }
              />

              <SummaryItem
                icon={ShieldCheck}
                label="Dosage"
                value={
                  form.dosage.trim()
                    ? `${form.dosage} · ${form.medicationType}`
                    : "Not entered"
                }
              />

              <SummaryItem
                icon={BellRing}
                label="Frequency"
                value={
                  selectedFrequency.label
                }
              />

              <SummaryItem
                icon={Clock3}
                label="Reminder times"
                value={reminderTimes
                  .map(formatTime)
                  .join(", ")}
              />

              <SummaryItem
                icon={CalendarDays}
                label="Treatment period"
                value={`${formatDisplayDate(
                  form.startDate
                )} — ${formatDisplayDate(
                  form.endDate
                )}`}
              />

              <SummaryItem
                icon={NotebookPen}
                label="Instruction"
                value={
                  selectedInstruction.label
                }
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#1E63C6]/5 p-4">
              <div className="flex items-start gap-3">
                <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-[#1E63C6]" />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#1E63C6]">
                    Notification status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {form.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pageDisabled}
              style={{
                backgroundColor:
                  pageDisabled
                    ? HOKU_PRIMARY_DARK
                    : HOKU_PRIMARY,
              }}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1E63C6]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />

                  {isEditMode
                    ? "Updating reminder..."
                    : "Creating reminder..."}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  {isEditMode
                    ? "Update Reminder"
                    : "Create Reminder"}
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

              <p className="text-xs leading-5 text-emerald-700">
                Always follow the dosage and
                instructions provided by your
                healthcare professional.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}