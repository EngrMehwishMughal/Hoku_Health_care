import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import StatCard from "../../components/StatCard";
import AppointmentCard from "../../components/AppointmentCard";
import PatientCard from "../../components/PatientCard";
import CalendarWidget from "../../components/CalendarWidget";

const stats = [
  {
    title: "Today's Appointments",
    value: "24",
    detail: "+8% from yesterday",
    icon: FiCalendar,
    accent: "from-[var(--primary)] to-blue-400",
  },
  {
    title: "Total Patients",
    value: "1,284",
    detail: "Updated 10 minutes ago",
    icon: FiUsers,
    accent: "from-[var(--secondary)] to-[var(--primary)]",
  },
  {
    title: "Completed",
    value: "18",
    detail: "75% completion rate",
    icon: FiCheckCircle,
    accent: "from-emerald-500 to-[var(--primary)]",
  },
  {
    title: "Pending",
    value: "6",
    detail: "Needs follow-up",
    icon: FiClock,
    accent: "from-amber-500 to-[var(--primary)]",
  },
];

const appointments = [
  {
    id: 1,
    patient: "Olivia Chen",
    reason: "Routine Checkup",
    time: "09:30 AM",
    type: "Video",
    status: "Upcoming",
  },
  {
    id: 2,
    patient: "Daniel Kim",
    reason: "Cardiology Review",
    time: "11:00 AM",
    type: "In Clinic",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Ava Patel",
    reason: "Lab Results",
    time: "01:30 PM",
    type: "Follow-up",
    status: "Completed",
  },
];

const patients = [
  {
    id: 1,
    name: "Sophia Lewis",
    condition: "Migraine",
    lastVisit: "2 days ago",
    phone: "+1 203 555 0182",
    bloodGroup: "A+",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Noah Rivera",
    condition: "Hypertension",
    lastVisit: "1 week ago",
    phone: "+1 305 555 0147",
    bloodGroup: "O-",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

const notifications = [
  {
    id: 1,
    message: "New lab report received for Olivia Chen.",
    time: "10 minutes ago",
  },
  {
    id: 2,
    message: "Appointment reminder sent to 3 patients.",
    time: "35 minutes ago",
  },
  {
    id: 3,
    message: "Availability updated for Friday.",
    time: "1 hour ago",
  },
];

const revenueBars = [42, 58, 46, 72, 62, 84, 76];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-gradient-to-br from-[var(--primary)] to-blue-500 p-6 text-white shadow-[var(--shadow-soft)] sm:p-7"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/75">
                  Practice Overview
                </p>

                <h1 className="mt-2 max-w-xl text-2xl font-bold leading-tight sm:text-3xl">
                  Your patients are in great hands today.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
                  Monitor appointments, patient activity, and daily practice
                  performance from one place.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                <FiTrendingUp size={23} />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <OverviewBadge text="Revenue +12%" />
              <OverviewBadge text="28 bookings" />
              <OverviewBadge text="4 reminders" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--body)]">
                Monthly Revenue
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[var(--heading)]">
                $12,480
              </h2>

              <p className="mt-1 text-xs font-medium text-emerald-600">
                +12.4% from last month
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--primary-light)] p-3 text-[var(--primary)]">
              <FiActivity size={21} />
            </div>
          </div>

          <div className="mt-7 flex h-24 items-end gap-2">
            {revenueBars.map((height, index) => (
              <motion.div
                key={`${height}-${index}`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-[var(--primary)] to-blue-300 opacity-85"
              />
            ))}
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-medium text-[var(--body)]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.06,
            }}
          >
            <StatCard {...item} />
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.7fr]">
        <div className="space-y-6">
          <DashboardSection
            title="Today's Schedule"
            description="Appointments scheduled for today"
            actionLabel="View all"
            onAction={() => navigate("/doctor/appointments")}
          >
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FiCalendar}
                title="No appointments today"
                description="Your scheduled appointments will appear here."
              />
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent Patients"
            description="Latest patient interactions"
            actionLabel="See history"
            onAction={() => navigate("/doctor/patients")}
          >
            {patients.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {patients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FiUsers}
                title="No recent patients"
                description="Recent patient activity will appear here."
              />
            )}
          </DashboardSection>
        </div>

        <aside className="space-y-6">
          <CalendarWidget />

          <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--heading)]">
                  Latest Notifications
                </h2>

                <p className="mt-1 text-sm text-[var(--body)]">
                  Recent updates from your practice
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-[var(--primary)] transition hover:text-[var(--primary-hover)]"
              >
                Mark all read
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--section)] p-4 transition hover:border-[var(--primary)]"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--primary)]" />

                  <div>
                    <p className="text-sm font-medium leading-6 text-[var(--heading)]">
                      {notification.message}
                    </p>

                    <p className="mt-1 text-xs text-[var(--body)]">
                      {notification.time}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </motion.main>
  );
}

function OverviewBadge({ text }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/15 px-3 py-1.5 font-medium text-white backdrop-blur-sm">
      {text}
    </span>
  );
}

function DashboardSection({
  title,
  description,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--body)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[var(--primary-light)] px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
        >
          {actionLabel}
          <FiArrowUpRight size={15} />
        </button>
      </div>

      {children}
    </section>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--section)] px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
        <Icon size={21} />
      </div>

      <h3 className="mt-4 font-semibold text-[var(--heading)]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[var(--body)]">
        {description}
      </p>
    </div>
  );
}