import contactImage from "@/assets/contactImage.png";
import ContactForm from "@/components/contact/ContactForm";

const GetInTouch = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#FAFAFA] px-5 pb-0 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24"
    >
      {/* Bottom dark background */}
      <div
className="
absolute
bottom-0
inset-x-0
h-[185px]
bg-[#1A1A1A]
"
      style={{
        clipPath:
        "polygon(0 27%,68% 0,100% 27%,100% 100%,0 100%)"
        }} 
      />

      {/* Decorative diagonal ribbons */}
      <div
className="
absolute
bottom-[164px]
left-0
w-full
h-[8px]
bg-[#9CCB39]
"
style={{
  clipPath:
  "polygon(0 78%,68% 0,100% 78%,100% 100%,0 100%)"
  }}
/>

<div
className="
absolute
bottom-[150px]
left-0
w-full
h-[16px]
bg-[#1268AE]
"
style={{
  clipPath:
  "polygon(0 76%,68% 0,100% 76%,100% 100%,0 100%)"
  }}
/>

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
          <div className="grid min-h-[350px] lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left image */}
            <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[350px]">
              <img
                src={contactImage}
                alt="Healthcare professional assisting a patient"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10" />
            </div>

            {/* Right form */}
            <div className="flex items-center bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-8 xl:px-16">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;