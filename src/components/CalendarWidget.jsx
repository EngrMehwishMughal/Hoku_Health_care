import dayjs from "dayjs";

export default function CalendarWidget() {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const today = dayjs();
  const startOfMonth = today.startOf("month").day();
  const daysInMonth = today.daysInMonth();

  const cells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - startOfMonth + 1;

    return dayNumber > 0 && dayNumber <= daysInMonth
      ? dayNumber
      : null;
  });

  return (
    <section
      className="rounded-[var(--radius-xl)] border border-[var(--border)]
                 bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]"
    >
      {/* Calendar header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">
            Calendar
          </p>

          <h3 className="mt-1 font-heading text-lg font-semibold text-[var(--heading)]">
            {today.format("MMMM YYYY")}
          </h3>
        </div>

        <span
          className="rounded-full bg-[var(--primary-light)] px-3 py-1.5
                     text-xs font-semibold text-[var(--primary)]"
        >
          Today: {today.format("D MMM")}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center sm:gap-2">
        {/* Weekday names */}
        {weekDays.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="flex h-9 items-center justify-center text-xs
                       font-semibold uppercase text-[var(--muted)]"
          >
            {day}
          </div>
        ))}

        {/* Date cells */}
        {cells.map((day, index) => {
          const isToday = day === today.date();

          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="h-10 sm:h-11"
                aria-hidden="true"
              />
            );
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              aria-label={`${today.format("MMMM")} ${day}`}
              aria-current={isToday ? "date" : undefined}
              className={`flex h-10 items-center justify-center
                          rounded-[var(--radius-md)] text-sm font-medium
                          transition duration-300 sm:h-11 ${
                            isToday
                              ? `bg-[var(--primary)] text-[var(--white)]
                                 shadow-[var(--shadow-button)]`
                              : `bg-[var(--section)] text-[var(--body)]
                                 hover:bg-[var(--primary-light)]
                                 hover:text-[var(--primary)]`
                          }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </section>
  );
}