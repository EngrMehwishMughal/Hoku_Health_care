import { FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import ServiceCard from "@/components/services/ServiceCard";
import ServicesData from "@/data/ServicesData";

const Services = () => {
  const activeServices = ServicesData.filter(
    (service) => service.status === "active"
  );

  return (
    <main>
      {/* Page Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1268AE] to-[#0D568F] px-5 py-20 text-white sm:py-24 lg:py-28">
        {/* Decorative Shapes */}
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#9CCB39]/20" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide backdrop-blur-sm">
            Our Healthcare Services
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Compassionate Care for Every Stage of Life
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
            Explore our professional healthcare services designed to provide
            comfort, dignity, personalized support, and a better quality of
            life for patients and their families.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors duration-300 hover:text-[#9CCB39]"
            >
              Home
            </Link>

            <span>/</span>

            <span className="text-[#9CCB39]">Services</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-[#F8F8F8] px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Heading */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-block rounded-full bg-[#EAF3FB] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-[#1268AE]">
              What We Offer
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#1F1F1F] sm:text-4xl lg:text-5xl">
              Professional Healthcare Services Tailored to Your Needs
            </h2>

            <p className="mt-5 text-base leading-8 text-[#555555] sm:text-lg">
              Our experienced healthcare professionals provide reliable,
              respectful, and personalized care in a safe and comfortable
              environment.
            </p>
          </div>

          {/* Cards */}
          {activeServices.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activeServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-[#1F1F1F]">
                No services are currently available
              </h3>

              <p className="mt-3 text-[#555555]">
                Please check again later or contact our healthcare team.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#F1F8E4] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-[#5C8511]">
              Why Choose HOKU
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#1F1F1F] sm:text-4xl lg:text-5xl">
              Trusted Healthcare Delivered with Compassion
            </h2>

            <p className="mt-6 text-base leading-8 text-[#555555] sm:text-lg">
              We focus on delivering patient-centered care that supports
              physical comfort, emotional well-being, independence, and
              dignity.
            </p>

            <Link
              to="/appointment"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1268AE] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#0D568F]"
            >
              Book an Appointment
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "Experienced Professionals",
                text: "Qualified healthcare specialists committed to safe and reliable patient care.",
              },
              {
                number: "02",
                title: "Personalized Care Plans",
                text: "Every care plan is designed around the patient's condition, needs, and preferences.",
              },
              {
                number: "03",
                title: "Available 24/7",
                text: "Our healthcare team is available whenever patients and families require support.",
              },
              {
                number: "04",
                title: "Compassionate Support",
                text: "We provide respectful physical, emotional, and family-centered assistance.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-3xl border border-[#E8E8E8] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#9CCB39] hover:shadow-xl"
              >
                <span className="text-3xl font-bold text-[#9CCB39]">
                  {item.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-[#1F1F1F]">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-[#555555]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F8F8] px-5 pb-20 pt-6 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-r from-[#1268AE] to-[#0D568F] px-6 py-14 text-center text-white sm:px-10 sm:py-16 lg:px-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Need Help Choosing the Right Service?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Speak with our healthcare team to discuss your needs and find the
            most suitable care option for you or your loved one.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#9CCB39] px-8 py-4 font-semibold text-[#1F1F1F] transition-all duration-300 hover:scale-105"
            >
              Contact Our Team
              <FaArrowRight />
            </Link>

            <a
              href="tel:+1234567890"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#1268AE]"
            >
              <FaPhoneAlt />
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;