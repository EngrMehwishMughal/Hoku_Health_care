import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

const statusStyles = {
  Upcoming:
    "bg-[var(--primary-light)] text-[var(--primary)]",

  Completed:
    "bg-[#DCFCE7] text-[var(--success)]",

  Cancelled:
    "bg-[#FEE2E2] text-[var(--danger)]",

  Pending:
    "bg-[#FEF3C7] text-[var(--warning)]",
};

export default function AppointmentCard({ appointment }) {
  const currentStatusStyle =
    statusStyles[appointment.status] ?? statusStyles.Pending;

  return (
    <article
      className="rounded-[var(--radius-xl)] border border-[var(--border)]
                 bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]
                 transition duration-300 hover:-translate-y-0.5
                 hover:shadow-[var(--shadow-card)]"
    >
      {/* Patient and status */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--heading)]">
            {appointment.patient}
          </p>

          <p className="mt-1 text-sm text-[var(--muted)]">
            {appointment.reason}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${currentStatusStyle}`}
        >
          {appointment.status}
        </span>
      </div>

      {/* Appointment information */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <FiClock
            size={14}
            className="text-[var(--primary)]"
          />

          {appointment.time}
        </span>

        <span className="flex items-center gap-2">
          <FiCheckCircle
            size={14}
            className="text-[var(--secondary-hover)]"
          />

          {appointment.type}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-[var(--radius-md)] bg-[var(--primary)]
                     px-3 py-2 text-sm font-medium text-[var(--white)]
                     shadow-[var(--shadow-button)] transition duration-300
                     hover:bg-[var(--primary-hover)]"
        >
          Approve
        </button>

        <button
          type="button"
          className="rounded-[var(--radius-md)] border
                     border-[var(--border)] bg-[var(--card)]
                     px-3 py-2 text-sm font-medium text-[var(--heading)]
                     transition duration-300
                     hover:border-[var(--primary)]
                     hover:bg-[var(--primary-light)]
                     hover:text-[var(--primary)]"
        >
          View
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[var(--radius-md)]
                     border border-[var(--border)] bg-[var(--card)]
                     px-3 py-2 text-sm font-medium text-[var(--danger)]
                     transition duration-300 hover:border-[var(--danger)]
                     hover:bg-[#FEE2E2]"
        >
          <FiXCircle />

          Cancel
        </button>
      </div>
    </article>
  );
}