import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowRight,
  FaPhoneAlt,
} from "react-icons/fa";

const ServiceDetail = ({ service }) => {
  if (!service) {
    return (
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold text-[#1F1F1F]">
          Service not found
        </h2>

        <Link
          to="/services"
          className="mt-8 inline-flex rounded-full bg-[#1268AE] px-6 py-3 font-semibold text-white transition hover:bg-[#0D568F]"
        >
          Back to Services
        </Link>
      </section>
    );
  }

  const {
    title,
    image,
    fullDescription,
    features,
    benefits,
  } = service;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5">

        {/* Top Section */}
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Image */}
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div>

            <span className="rounded-full bg-[#EAF3FB] px-5 py-2 text-sm font-semibold text-[#1268AE]">
              Professional Healthcare
            </span>

            <h2 className="mt-5 text-4xl font-bold text-[#1F1F1F]">
              {title}
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#555555]">
              {fullDescription}
            </p>

            {/* Features */}
            <div className="mt-10">
              <h3 className="mb-5 text-2xl font-semibold text-[#1F1F1F]">
                What's Included
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-[#9CCB39]" />

                    <span className="text-[#555555]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Benefits */}
        <div className="mt-20 rounded-3xl bg-[#F8F8F8] p-10">

          <h3 className="mb-8 text-center text-3xl font-bold text-[#1F1F1F]">
            Benefits of This Service
          </h3>

          <div className="grid gap-6 md:grid-cols-2">

            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1268AE] text-white">
                  <FaCheckCircle />
                </div>

                <p className="text-[#555555]">
                  {benefit}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* CTA */}
        <div className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1268AE] to-[#0D568F] p-10 text-center text-white">

          <h2 className="text-4xl font-bold">
            Need Professional Healthcare?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
            Our experienced healthcare professionals are available to
            provide compassionate, high-quality care tailored to your
            individual needs.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Link
              to="/appointment"
              className="inline-flex items-center gap-3 rounded-full bg-[#9CCB39] px-8 py-4 font-semibold text-[#1F1F1F] transition hover:scale-105"
            >
              Book Appointment

              <FaArrowRight />
            </Link>

            <a
              href="tel:+1234567890"
              className="inline-flex items-center gap-3 rounded-full border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-[#1268AE]"
            >
              <FaPhoneAlt />

              Call Us
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ServiceDetail;