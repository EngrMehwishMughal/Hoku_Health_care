import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const ServiceCard = ({ service }) => {
  const {
    slug,
    title,
    image,
    shortDescription,
  } = service;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="space-y-5 p-7">
        <h3 className="text-2xl font-bold text-[#1F1F1F] transition-colors duration-300 group-hover:text-[#1268AE]">
          {title}
        </h3>

        <p className="line-clamp-3 text-[15px] leading-7 text-[#555555]">
          {shortDescription}
        </p>

        <Link to={`/services/${service.slug}`}
          className="inline-flex items-center gap-3 font-semibold text-[#1268AE] transition-all duration-300 hover:gap-4 hover:text-[#0D568F]"
        >
          Learn More

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1268AE] text-white transition-all duration-300 group-hover:bg-[#9CCB39]">
            <FaArrowRight size={14} />
          </span>
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;