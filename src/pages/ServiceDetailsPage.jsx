import { Link, useParams } from "react-router-dom";

import ServiceDetail from "@/components/services/ServiceDetail";
import ServicesData from "@/data/ServicesData";

const ServiceDetailsPage = () => {
  const { slug } = useParams();

  const service = ServicesData.find(
    (item) => item.slug === slug && item.status === "active"
  );

  if (!service) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[var(--section)] px-5 py-20">
        <div className="max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
            Service unavailable
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[var(--heading)] sm:text-4xl">
            Service Not Found
          </h1>

          <p className="mt-4 leading-7 text-[var(--body)]">
            The healthcare service you requested does not exist or is currently
            unavailable.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-flex rounded-lg bg-[var(--primary)] px-7 py-3 font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Back to Services
          </Link>
        </div>
      </section>
    );
  }

  return <ServiceDetail service={service} />;
};

export default ServiceDetailsPage;