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

export default function StatusBadge({ status = "Pending" }) {
  const selectedStyle =
    statusStyles[status] ??
    "bg-[var(--section)] text-[var(--body)]";

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap
                  rounded-full px-3 py-1 text-xs font-semibold
                  ${selectedStyle}`}
    >
      {status}
    </span>
  );
}