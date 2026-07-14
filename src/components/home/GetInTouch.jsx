import contactImage from "@/assets/contactImage.png";
import ContactForm from "@/components/contact/ContactForm";

const GetInTouch = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -bottom-20 right-0 h-40 w-[55%] -rotate-6 bg-[#1268AE]" />
      <div className="pointer-events-none absolute -bottom-8 right-0 h-7 w-[58%] -rotate-6 bg-[#9CCB39]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_14px_45px_rgba(0,0,0,0.15)]">
          <div className="grid lg:grid-cols-2">
            {/* Left image */}
            <div className="relative min-h-[360px] sm:min-h-[450px] lg:min-h-[570px]">
              <img
                src={contactImage}
                alt="Healthcare professional assisting a patient online"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0A4777]/20 via-transparent to-transparent" />
            </div>

            {/* Right reusable form */}
            <div className="flex items-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;