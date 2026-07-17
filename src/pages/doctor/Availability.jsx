import { useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialAvailability = {
  Monday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    slot: "30",
  },
  Tuesday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    slot: "30",
  },
  Wednesday: {
    enabled: false,
    start: "09:00",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    slot: "30",
  },
  Thursday: {
    enabled: true,
    start: "09:00",
    end: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    slot: "30",
  },
  Friday: {
    enabled: true,
    start: "10:00",
    end: "18:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    slot: "45",
  },
  Saturday: {
    enabled: false,
    start: "10:00",
    end: "15:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    slot: "45",
  },
  Sunday: {
    enabled: false,
    start: "10:00",
    end: "15:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    slot: "45",
  },
};

const slotOptions = ["15", "20", "30", "45", "60"];

export default function Availability() {
  const [availability, setAvailability] = useState(initialAvailability);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => {
    setAvailability((previousAvailability) => ({
      ...previousAvailability,
      [day]: {
        ...previousAvailability[day],
        enabled: !previousAvailability[day].enabled,
      },
    }));
  };

  const updateField = (day, field, value) => {
    setAvailability((previousAvailability) => ({
      ...previousAvailability,
      [day]: {
        ...previousAvailability[day],
        [field]: value,
      },
    }));
  };

  const validateAvailability = () => {
    for (const day of days) {
      const entry = availability[day];

      if (!entry.enabled) continue;

      if (!entry.start || !entry.end) {
        toast.error(`Please enter working hours for ${day}.`);
        return false;
      }

      if (entry.start >= entry.end) {
        toast.error(`${day}'s start time must be before the end time.`);
        return false;
      }

      if (
        entry.lunchStart &&
        entry.lunchEnd &&
        entry.lunchStart >= entry.lunchEnd
      ) {
        toast.error(`${day}'s lunch start must be before lunch end.`);
        return false;
      }

      if (
        entry.lunchStart &&
        (entry.lunchStart < entry.start || entry.lunchStart > entry.end)
      ) {
        toast.error(`${day}'s lunch time must be within working hours.`);
        return false;
      }

      if (
        entry.lunchEnd &&
        (entry.lunchEnd < entry.start || entry.lunchEnd > entry.end)
      ) {
        toast.error(`${day}'s lunch time must be within working hours.`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateAvailability()) return;

    try {
      setSaving(true);

      const payload = days.map((day) => ({
        day: day.toLowerCase(),
        enabled: availability[day].enabled,
        start_time: availability[day].start,
        end_time: availability[day].end,
        lunch_start: availability[day].lunchStart,
        lunch_end: availability[day].lunchEnd,
        slot_duration: Number(availability[day].slot),
      }));

      // Replace with the doctor availability API.
      // await updateDoctorAvailability(payload);

      console.log("Availability payload:", payload);

      toast.success("Availability updated successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to save availability. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--primary)]">
              Doctor Portal
            </p>

            <h1 className="text-2xl font-bold text-[var(--heading)] sm:text-3xl">
              Availability Manager
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--body)]">
              Set your consultation hours, breaks, and appointment duration.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSave size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {days.map((day, index) => {
          const entry = availability[day];

          return (
            <motion.article
              key={day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
              }}
              className={`rounded-[28px] border bg-white p-5 shadow-[var(--shadow-soft)] transition sm:p-6 ${
                entry.enabled
                  ? "border-[var(--border)]"
                  : "border-[var(--border)] opacity-75"
              }`}
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-48 items-center gap-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={entry.enabled}
                    onClick={() => toggleDay(day)}
                    className={`relative h-7 w-12 rounded-full transition ${
                      entry.enabled
                        ? "bg-[var(--primary)]"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        entry.enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>

                  <div>
                    <h2 className="text-lg font-semibold text-[var(--heading)]">
                      {day}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--body)]">
                      {entry.enabled
                        ? "Available for appointments"
                        : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <TimeField
                    label="Start Time"
                    value={entry.start}
                    disabled={!entry.enabled}
                    onChange={(value) =>
                      updateField(day, "start", value)
                    }
                  />

                  <TimeField
                    label="End Time"
                    value={entry.end}
                    disabled={!entry.enabled}
                    onChange={(value) =>
                      updateField(day, "end", value)
                    }
                  />

                  <TimeField
                    label="Lunch Start"
                    value={entry.lunchStart}
                    disabled={!entry.enabled}
                    onChange={(value) =>
                      updateField(day, "lunchStart", value)
                    }
                  />

                  <TimeField
                    label="Lunch End"
                    value={entry.lunchEnd}
                    disabled={!entry.enabled}
                    onChange={(value) =>
                      updateField(day, "lunchEnd", value)
                    }
                  />

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[var(--body)]">
                      Slot Duration
                    </span>

                    <div className="relative">
                      <FiClock
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--body)]"
                      />

                      <select
                        value={entry.slot}
                        disabled={!entry.enabled}
                        onChange={(event) =>
                          updateField(day, "slot", event.target.value)
                        }
                        className="min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white py-2 pl-9 pr-8 text-sm text-[var(--heading)] outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:bg-[var(--section)] disabled:opacity-60"
                      >
                        {slotOptions.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot} minutes
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>
    </motion.div>
  );
}

function TimeField({ label, value, disabled, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--body)]">
        {label}
      </span>

      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--heading)] outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:bg-[var(--section)] disabled:opacity-60"
      />
    </label>
  );
}