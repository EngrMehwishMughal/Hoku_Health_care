import { motion } from "framer-motion";

const accentStyles = {
  primary:
    "from-[var(--primary)] to-[var(--info)]",

  secondary:
    "from-[var(--secondary-hover)] to-[var(--secondary)]",

  success:
    "from-[var(--success)] to-[#4ADE80]",

  warning:
    "from-[var(--warning)] to-[#FBBF24]",

  danger:
    "from-[var(--danger)] to-[#F87171]",

  info:
    "from-[var(--info)] to-[#38BDF8]",
};

export default function StatCard({
  icon: Icon,
  title,
  value,
  detail,
  accent = "primary",
}) {
  const selectedAccent =
    accentStyles[accent] ?? accentStyles.primary;

  return (
    <motion.article
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="rounded-[var(--radius-xl)] border
                 border-[var(--border)] bg-[var(--card)]
                 p-5 shadow-[var(--shadow-soft)]
                 transition-shadow duration-300
                 hover:shadow-[var(--shadow-card)]"
    >
      {/* Icon */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center
                    rounded-[var(--radius-lg)] bg-gradient-to-br
                    text-[var(--white)] shadow-[var(--shadow-soft)]
                    ${selectedAccent}`}
      >
        <Icon size={20} />
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[var(--muted)]">
        {title}
      </p>

      {/* Value */}
      <h3 className="mt-2 font-heading text-2xl font-semibold text-[var(--heading)]">
        {value}
      </h3>

      {/* Additional information */}
      {detail && (
        <p className="mt-2 text-sm font-medium text-[var(--success)]">
          {detail}
        </p>
      )}
    </motion.article>
  );
}