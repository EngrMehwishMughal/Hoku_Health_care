import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaBriefcaseMedical,
} from "react-icons/fa";

const SpecialistCard = ({ specialist }) => {
  const {
    slug,
    name,
    specialty,
    qualification,
    experienceYears,
    consultationFee,
    image,
    bio,
    isAvailable,
  } = specialist;

  return (
    <article className="group overflow-hidden rounded-[24px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
      <div className="relative h-[310px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-semibold ${
            isAvailable
              ? "bg-[#9CCB39] text-[#1F1F1F]"
              : "bg-red-500 text-white"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#9CCB39]">
          {specialty}
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#1F1F1F] transition-colors group-hover:text-[#1268AE]">
          {name}
        </h2>

        <p className="mt-2 text-sm font-medium text-[#555555]">
          {qualification}
        </p>

        <p className="mt-4 line-clamp-3 leading-7 text-[#666666]">
          {bio}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#555555]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F8F8] px-3 py-2">
            <FaBriefcaseMedical className="text-[#1268AE]" />
            {experienceYears} Years
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#F8F8F8] px-3 py-2">
            <FaCalendarAlt className="text-[#1268AE]" />
            PKR {consultationFee}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/specialists/${slug}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1268AE] px-5 py-3 text-sm font-semibold text-[#1268AE] transition hover:bg-[#1268AE] hover:text-white"
          >
            View Profile
            <FaArrowRight />
          </Link>

          <Link
            to={`/appointment?doctor=${slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#1268AE] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0D568F]"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </article>
  );
};

export default SpecialistCard;