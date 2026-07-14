import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

import SpecialistCard from "@/components/specialists/SpecialistCard";
import specialistsData from "@/data/SpecialistData";

const Specialists = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const specialties = [
    "All",
    ...new Set(specialistsData.map((doctor) => doctor.specialty)),
  ];

  const filteredSpecialists = useMemo(() => {
    return specialistsData.filter((doctor) => {
      const matchesSpecialty =
        selectedSpecialty === "All" ||
        doctor.specialty === selectedSpecialty;

      const searchValue = searchTerm.toLowerCase().trim();

      const matchesSearch =
        doctor.name.toLowerCase().includes(searchValue) ||
        doctor.specialty.toLowerCase().includes(searchValue) ||
        doctor.qualification.toLowerCase().includes(searchValue);

      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchTerm]);

  return (
    <main>
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1268AE] to-[#0D568F] px-5 py-20 text-white sm:py-24">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#9CCB39]/20" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9CCB39]">
            Healthcare Professionals
          </p>

          <h1 className="mt-4 text-4xl font-extrabold uppercase sm:text-5xl lg:text-6xl">
            Meet Our Specialists
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Find an experienced healthcare professional based on your medical
            needs and preferred specialty.
          </p>

          <div className="mt-7 flex justify-center gap-3 text-sm">
            <Link to="/" className="hover:text-[#9CCB39]">
              Home
            </Link>

            <span>/</span>
            <span className="text-[#9CCB39]">Specialists</span>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="bg-[#F8F8F8] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9CCB39]">
              Our Medical Team
            </p>

            <h2 className="mt-3 text-3xl font-extrabold uppercase text-[#1268AE] sm:text-4xl">
              Choose the Right Specialist
            </h2>

            <p className="mt-5 leading-8 text-[#555555]">
              Search and filter our healthcare professionals by their name,
              qualification, or medical specialty.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-12 rounded-[20px] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.07)] sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777777]" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search doctor or specialty..."
                  className="w-full rounded-lg border border-[#E0E0E0] bg-white py-3 pl-11 pr-4 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1268AE] focus:ring-4 focus:ring-[#1268AE]/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      selectedSpecialty === specialty
                        ? "bg-[#1268AE] text-white"
                        : "bg-[#F1F1F1] text-[#555555] hover:bg-[#EAF3FB] hover:text-[#1268AE]"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {filteredSpecialists.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredSpecialists.map((specialist) => (
                <SpecialistCard
                  key={specialist.id}
                  specialist={specialist}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[20px] bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-[#1F1F1F]">
                No specialists found
              </h3>

              <p className="mt-3 text-[#555555]">
                Try changing the specialty filter or search term.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Specialists;