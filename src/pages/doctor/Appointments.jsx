import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiEye,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import StatusBadge from "../../components/StatusBadge";

const appointments = [
  {
    id: 1,
    patient: "Liam Carter",
    date: "2026-07-15",
    time: "09:00 AM",
    status: "Upcoming",
    type: "Video",
  },
  {
    id: 2,
    patient: "Mia Johnson",
    date: "2026-07-15",
    time: "11:30 AM",
    status: "Pending",
    type: "In Clinic",
  },
  {
    id: 3,
    patient: "Ethan Brooks",
    date: "2026-07-14",
    time: "04:00 PM",
    status: "Completed",
    type: "Follow-up",
  },
  {
    id: 4,
    patient: "Charlotte Reed",
    date: "2026-07-13",
    time: "02:30 PM",
    status: "Cancelled",
    type: "Video",
  },
];

const statusOptions = [
  "All",
  "Upcoming",
  "Pending",
  "Completed",
  "Cancelled",
];

export default function Appointments() {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patient.toLowerCase().includes(normalizedQuery) ||
        appointment.type.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        selectedStatus === "All" ||
        appointment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [query, selectedStatus]);

  const handleApprove = (appointment) => {
    // Replace with appointment approval API later.
    // await approveAppointment(appointment.id);

    toast.success(
      `${appointment.patient}'s appointment has been approved.`
    );
  };

  const handleView = (appointment) => {
    // Replace with navigation or modal later.
    // navigate(`/doctor/appointments/${appointment.id}`);

    toast.info(`Opening appointment for ${appointment.patient}.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--primary)]">
              Doctor Portal
            </p>

            <h1 className="text-2xl font-bold text-[var(--heading)] sm:text-3xl">
              Appointments
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--body)]">
              Review, filter, and manage patient booking requests.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <label className="flex min-h-11 w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--section)] px-4 text-sm text-[var(--body)] transition focus-within:border-[var(--primary)] focus-within:bg-white sm:w-72">
              <FiSearch className="shrink-0" size={17} />

              <input
                type="search"
                placeholder="Search patient or type"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent py-3 text-[var(--heading)] outline-none placeholder:text-[var(--body)]"
              />
            </label>

            <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--heading)]">
              <FiFilter size={17} />

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
                className="cursor-pointer bg-transparent py-3 outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
        <div className="hidden grid-cols-[1.25fr_0.85fr_0.75fr_0.85fr_0.8fr_1fr] gap-4 border-b border-[var(--border)] bg-[var(--section)] px-5 py-4 text-sm font-semibold text-[var(--heading)] md:grid">
          <div>Patient</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
          <div>Type</div>
          <div>Actions</div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {filteredAppointments.map((appointment, index) => {
              const canApprove =
                appointment.status === "Pending";

              return (
                <motion.article
                  key={appointment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.04,
                  }}
                  className="grid gap-4 p-5 transition hover:bg-[var(--section)] md:grid-cols-[1.25fr_0.85fr_0.75fr_0.85fr_0.8fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-[var(--heading)]">
                      {appointment.patient}
                    </p>

                    <p className="mt-1 text-sm text-[var(--body)]">
                      Appointment #{appointment.id}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--body)] md:hidden">
                      Date
                    </p>

                    <div className="flex items-center gap-2 text-sm text-[var(--body)]">
                      <FiCalendar
                        className="text-[var(--primary)] md:hidden"
                        size={15}
                      />
                      {dayjs(appointment.date).format("DD MMM YYYY")}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--body)] md:hidden">
                      Time
                    </p>

                    <p className="text-sm text-[var(--body)]">
                      {appointment.time}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--body)] md:hidden">
                      Status
                    </p>

                    <StatusBadge status={appointment.status} />
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--body)] md:hidden">
                      Type
                    </p>

                    <p className="text-sm text-[var(--body)]">
                      {appointment.type}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {canApprove && (
                      <button
                        type="button"
                        onClick={() => handleApprove(appointment)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                      >
                        <FiCheck size={14} />
                        Approve
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleView(appointment)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--heading)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <FiEye size={14} />
                      View
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
              <FiCalendar size={24} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">
              No appointments found
            </h3>

            <p className="mt-2 text-sm text-[var(--body)]">
              Try changing your search text or status filter.
            </p>
          </div>
        )}
      </section>
    </motion.div>
  );
}