import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiAlertCircle,
  FiCalendar,
  FiFileText,
  FiHeart,
  FiPhone,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import dayjs from "dayjs";

const patients = [
  {
    id: 1,
    name: "Sophia Lewis",
    age: 32,
    gender: "Female",
    phone: "+1 203 555 0182",
    bloodGroup: "A+",
    history: "Migraine, Sleep Disorder",
    previousVisits: ["2026-06-10", "2026-05-08", "2026-03-15"],
    prescriptions: ["Sumatriptan 50mg", "Melatonin 3mg"],
    labReports: ["CBC Normal", "MRI Review"],
    allergies: ["Peanuts", "Latex"],
    notes:
      "Patient responds well to lifestyle changes and sleep hygiene.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Noah Rivera",
    age: 45,
    gender: "Male",
    phone: "+1 305 555 0147",
    bloodGroup: "O-",
    history: "Hypertension",
    previousVisits: ["2026-06-25", "2026-04-18"],
    prescriptions: ["Amlodipine 5mg"],
    labReports: ["Blood Pressure Review", "Lipid Profile"],
    allergies: [],
    notes:
      "Continue blood pressure monitoring and reduce dietary sodium.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function PatientHistory() {
  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(
    patients[0]?.id ?? null
  );

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return patients;

    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(normalizedQuery) ||
        patient.phone.toLowerCase().includes(normalizedQuery) ||
        patient.history.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query]);

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ||
    filteredPatients[0] ||
    null;

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    const firstMatchingPatient = patients.find((patient) => {
      const normalizedValue = value.trim().toLowerCase();

      return (
        patient.name.toLowerCase().includes(normalizedValue) ||
        patient.phone.toLowerCase().includes(normalizedValue) ||
        patient.history.toLowerCase().includes(normalizedValue)
      );
    });

    if (firstMatchingPatient) {
      setSelectedPatientId(firstMatchingPatient.id);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--primary)]">
              Doctor Portal
            </p>

            <h1 className="text-2xl font-bold text-[var(--heading)] sm:text-3xl">
              Patient History
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--body)]">
              Review medical records, prescriptions, lab reports, and previous
              consultations.
            </p>
          </div>

          <label className="flex min-h-11 w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--section)] px-4 transition focus-within:border-[var(--primary)] focus-within:bg-white lg:w-80">
            <FiSearch
              size={17}
              className="shrink-0 text-[var(--body)]"
            />

            <input
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search patient"
              className="w-full bg-transparent py-3 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--body)]"
            />
          </label>
        </div>
      </section>

      {filteredPatients.length > 1 && (
        <section className="rounded-[28px] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatientId === patient.id;

              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`flex min-w-max items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--primary)]"
                  }`}
                >
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[var(--heading)]">
                      {patient.name}
                    </p>

                    <p className="text-xs text-[var(--body)]">
                      {patient.history}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {selectedPatient ? (
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.name}
                  className="h-20 w-20 rounded-3xl object-cover"
                />

                <div>
                  <h2 className="text-xl font-bold text-[var(--heading)]">
                    {selectedPatient.name}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--body)]">
                    {selectedPatient.gender} • {selectedPatient.age} years
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <ProfileItem
                  icon={FiPhone}
                  label="Phone"
                  value={selectedPatient.phone}
                />

                <ProfileItem
                  icon={FiHeart}
                  label="Blood Group"
                  value={selectedPatient.bloodGroup}
                />

                <ProfileItem
                  icon={FiCalendar}
                  label="Last Visit"
                  value={
                    selectedPatient.previousVisits.length
                      ? dayjs(selectedPatient.previousVisits[0]).format(
                          "DD MMM YYYY"
                        )
                      : "No visit recorded"
                  }
                />

                <ProfileItem
                  icon={FiActivity}
                  label="Condition"
                  value={selectedPatient.history}
                />
              </div>
            </section>

            <InfoSection
              icon={FiAlertCircle}
              title="Allergies"
            >
              {selectedPatient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--body)]">
                  No allergies recorded.
                </p>
              )}
            </InfoSection>

            <InfoSection
              icon={FiFileText}
              title="Doctor Notes"
            >
              <p className="text-sm leading-6 text-[var(--body)]">
                {selectedPatient.notes || "No clinical notes available."}
              </p>
            </InfoSection>
          </aside>

          <div className="space-y-6">
            <InfoSection
              icon={FiActivity}
              title="Medical History"
            >
              <p className="text-sm leading-6 text-[var(--body)]">
                {selectedPatient.history}
              </p>
            </InfoSection>

            <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--heading)]">
                Prescriptions & Lab Reports
              </h2>

              <p className="mt-1 text-sm text-[var(--body)]">
                Current medication and recent diagnostic results.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <RecordList
                  title="Prescriptions"
                  items={selectedPatient.prescriptions}
                  emptyMessage="No prescriptions available."
                />

                <RecordList
                  title="Lab Reports"
                  items={selectedPatient.labReports}
                  emptyMessage="No lab reports available."
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--heading)]">
                  Visit Timeline
                </h2>

                <p className="mt-1 text-sm text-[var(--body)]">
                  Previous appointments and consultation history.
                </p>
              </div>

              {selectedPatient.previousVisits.length > 0 ? (
                <div className="mt-6 space-y-5 border-l-2 border-[var(--primary-light)] pl-6">
                  {selectedPatient.previousVisits.map((visit, index) => (
                    <motion.article
                      key={visit}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.06,
                      }}
                      className="relative rounded-2xl border border-[var(--border)] bg-[var(--section)] p-4"
                    >
                      <span className="absolute -left-[2rem] top-5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--primary)] shadow" />

                      <p className="font-semibold text-[var(--heading)]">
                        Consultation {index + 1}
                      </p>

                      <p className="mt-1 text-sm text-[var(--body)]">
                        Recorded on{" "}
                        {dayjs(visit).format("DD MMMM YYYY")}
                      </p>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </section>
          </div>
        </div>
      ) : (
        <section className="rounded-[28px] border border-[var(--border)] bg-white px-6 py-16 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
            <FiUser size={24} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[var(--heading)]">
            No patient found
          </h2>

          <p className="mt-2 text-sm text-[var(--body)]">
            Try searching with a different name, phone number, or condition.
          </p>
        </section>
      )}
    </motion.main>
  );
}

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[var(--section)] p-3">
      <div className="rounded-xl bg-[var(--primary-light)] p-2 text-[var(--primary)]">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--body)]">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-[var(--heading)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--primary-light)] p-2.5 text-[var(--primary)]">
          <Icon size={18} />
        </div>

        <h2 className="text-lg font-semibold text-[var(--heading)]">
          {title}
        </h2>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function RecordList({ title, items, emptyMessage }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--section)] p-4">
      <h3 className="font-semibold text-[var(--heading)]">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-[var(--body)]"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--body)]">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--section)] px-5 py-10 text-center">
      <FiCalendar
        size={24}
        className="mx-auto text-[var(--primary)]"
      />

      <p className="mt-3 text-sm font-medium text-[var(--heading)]">
        No previous visits recorded
      </p>
    </div>
  );
}