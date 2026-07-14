import { Link } from "react-router-dom";

import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";

const Contact = () => {
  return (
    <main>
      {/* Page Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] px-5 py-20 text-white sm:py-24">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[var(--secondary)]/20" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] backdrop-blur-sm">
            Contact HOKU
          </span>

          <h1 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">
            We Are Here to Support Your Healthcare Needs
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            Contact our team for home healthcare services, appointments, or
            general assistance.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 text-sm">
            <Link
              to="/"
              className="transition-colors hover:text-[var(--secondary)]"
            >
              Home
            </Link>

            <span>/</span>
            <span className="text-[var(--secondary)]">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-[var(--section)] px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
              Contact Information
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[var(--heading)] sm:text-4xl">
              Connect with Our Healthcare Team
            </h2>

            <p className="mt-4 leading-8 text-[var(--body)]">
              Our support team is available around the clock to answer your
              questions and guide you to the right healthcare service.
            </p>
          </div>

          <ContactInfo />
        </div>
      </section>

      {/* Form */}
      <section className="bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
              Available 24/7
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--heading)] sm:text-4xl">
              Let Us Know How We Can Help
            </h2>

            <p className="mt-5 leading-8 text-[var(--body)]">
              Whether you need home health care, palliative support, hospice
              services, or help booking an appointment, our team is ready to
              assist.
            </p>

            <div className="mt-8 rounded-2xl bg-[var(--primary-light)] p-6">
              <h3 className="text-xl font-bold text-[var(--heading)]">
                Working Hours
              </h3>

              <div className="mt-4 space-y-3 text-[var(--body)]">
                <div className="flex justify-between gap-4">
                  <span>Monday – Friday</span>
                  <span className="font-semibold text-[var(--heading)]">
                    24 Hours
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Saturday – Sunday</span>
                  <span className="font-semibold text-[var(--heading)]">
                    24 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Map */}
      <section className="bg-[var(--section)] px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
              Our Location
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[var(--heading)] sm:text-4xl">
              Find HOKU Health Care
            </h2>
          </div>

          <ContactMap />
        </div>
      </section>
    </main>
  );
};

export default Contact;