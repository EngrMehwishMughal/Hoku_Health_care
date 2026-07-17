import {
  FiCalendar,
  FiHeart,
  FiPhone,
} from "react-icons/fi";

export default function PatientCard({ patient }) {
  const patientName = patient?.name || "Patient";
  const initial = patientName.charAt(0).toUpperCase();

  return (
    <article
      className="rounded-[var(--radius-xl)] border border-[var(--border)]
                 bg-[var(--card)] p-4 shadow-[var(--shadow-soft)]
                 transition duration-300 hover:-translate-y-0.5
                 hover:border-[var(--primary-light)]
                 hover:shadow-[var(--shadow-card)]"
    >
      {/* Patient profile */}
      <div className="flex items-center gap-3">
        {patient?.avatar ? (
          <img
            src={patient.avatar}
            alt={patientName}
            className="h-12 w-12 shrink-0 rounded-full
                       border-2 border-[var(--primary-light)]
                       object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center
                       rounded-full bg-[var(--primary-light)]
                       font-semibold text-[var(--primary)]"
          >
            {initial}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate font-heading font-semibold text-[var(--heading)]">
            {patientName}
          </h3>

          <p className="mt-0.5 truncate text-sm text-[var(--muted)]">
            {patient?.condition || "No condition provided"}
          </p>
        </div>
      </div>

      {/* Patient information */}
      <div className="mt-4 space-y-3 text-sm text-[var(--body)]">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-[var(--radius-sm)]
                       bg-[var(--primary-light)]
                       text-[var(--primary)]"
          >
            <FiCalendar size={14} />
          </span>

          <span>
            {patient?.lastVisit || "No previous visit"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-[var(--radius-sm)]
                       bg-[var(--secondary-light)]
                       text-[var(--secondary-hover)]"
          >
            <FiPhone size={14} />
          </span>

          {patient?.phone ? (
            <a
              href={`tel:${patient.phone}`}
              className="transition hover:text-[var(--primary)]"
            >
              {patient.phone}
            </a>
          ) : (
            <span>No phone provided</span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-[var(--radius-sm)] bg-[#FEE2E2]
                       text-[var(--danger)]"
          >
            <FiHeart size={14} />
          </span>

          <span>
            Blood group: {patient?.bloodGroup || "Not provided"}
          </span>
        </div>
      </div>
    </article>
  );
}