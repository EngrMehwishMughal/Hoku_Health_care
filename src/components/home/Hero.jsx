import { Link } from "react-router-dom";
import hokudoctorpatient from "@/assets/hoku-doctor-patient.png";

const Hero = () => {
  const specialists = [
    "Child Specialist",
    "Gynecologist",
    "Dental Specialist",
    "Dermatologist",
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto grid min-h-[720px] max-w-[1280px] grid-cols-1 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
        {/* Left content */}
        <div className="relative z-30 order-2 flex items-center pb-32 pt-10 lg:order-1 lg:pb-36 lg:pt-0">
          <div className="w-full">
            {/* Script heading */}
            <p className="font-script text-[48px] leading-[0.8] text-[var(--heading)] sm:text-[58px] lg:text-[66px]">
              We take
            </p>

            {/* Main heading */}
            <h1 className="mt-3 uppercase">
              <div className="flex flex-wrap items-end gap-x-2 leading-none">
                <span className="font-heading text-[34px] font-black text-[var(--heading)] sm:text-[42px] lg:text-[46px]">
                  Care
                </span>

                <span className="font-heading text-[45px] font-black tracking-[-0.04em] text-[var(--primary)] sm:text-[54px] lg:text-[57px]">
                  Of Your
                </span>
              </div>

              <span className="mt-1 block font-heading text-[68px] font-black leading-[0.82] tracking-[-0.055em] text-[var(--heading)] sm:text-[84px] lg:text-[94px] xl:text-[102px]">
                Health
              </span>
            </h1>

            {/* Specialist heading */}
            <h2 className="mt-6 font-heading text-[21px] font-bold uppercase tracking-[-0.02em] text-[var(--primary)] sm:text-[24px]">
              Our Specialists
            </h2>

            {/* Specialists */}
            <div className="mt-4 grid max-w-[440px] grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {specialists.map((specialist) => (
                <div
                  key={specialist}
                  className="flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.02em] text-[var(--heading)]"
                >
                  <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--primary)]" />

                  {specialist}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/register"
              className="mt-8 inline-flex rounded-[7px] bg-[var(--primary)] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.04em] text-white shadow-[0_6px_15px_rgba(30,99,198,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)]"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative order-1 min-h-[480px] sm:min-h-[570px] lg:order-2 lg:min-h-[720px]">
          {/* Background panel */}
          <div
            className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-tl-[26px] rounded-br-[150px]
                       bg-gradient-to-br from-[#F7F9FC] via-[#EFF2F3] to-[#E4E7E5]
                       lg:left-2 lg:right-[-80px]"
          >
            {/* Subtle panel lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(255,255,255,0.95),transparent_38%)]" />

            {/* Blue vertical accent */}
            <div className="absolute left-0 top-0 h-full w-[7px] bg-gradient-to-b from-[var(--primary)] via-[#77A3D7] to-transparent" />

            {/* Health service badge */}
            <div
              className="absolute left-[9%] right-[-20px] top-6 z-30 flex h-[60px] items-center justify-center
                         rounded-l-[13px] border border-white/90 bg-white/25
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                         backdrop-blur-[2px]
                         sm:top-8 lg:left-[10%] lg:top-11"
            >
              <p className="font-heading text-[14px] font-bold uppercase tracking-[0.55em] text-[var(--primary)] sm:text-[17px] lg:text-[19px]">
                Health Service
              </p>
            </div>

            {/* Decorative soft shapes */}
            <div className="absolute bottom-[15%] left-[10%] h-52 w-52 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute right-[5%] top-[20%] h-64 w-64 rounded-full bg-white/35 blur-3xl" />
          </div>

          {/* Doctor and patient */}
          <img
            src={hokudoctorpatient}
            alt="Doctor examining an elderly patient"
            className="absolute bottom-[38px] left-[48%] z-20 h-auto w-[112%] max-w-none
                       -translate-x-1/2 object-contain object-bottom
                       sm:bottom-[45px] sm:w-[108%]
                       lg:bottom-[35px] lg:left-[52%] lg:w-[120%]
                       xl:left-[51%] xl:w-[116%]"
          />

          {/* Soft transition into left section */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[8%] bg-gradient-to-r from-white/45 to-transparent" />
        </div>
      </div>

      {/* Curved waves */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-40 w-full">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          className="block h-[90px] w-full sm:h-[108px] lg:h-[125px]"
          aria-hidden="true"
        >
          {/* Green wave */}
          <path
            d="M0,55 C330,121 695,140 1035,84 C1210,55 1335,23 1440,8
               L1440,39
               C1310,58 1190,88 1035,113
               C690,168 310,145 0,76 Z"
            fill="var(--secondary)"
          />

          {/* Blue wave */}
          <path
            d="M0,48 C335,108 695,126 1028,72
               C1200,44 1328,15 1440,3
               L1440,22
               C1310,41 1188,69 1030,95
               C690,150 315,129 0,64 Z"
            fill="var(--primary)"
          />

          {/* White foreground */}
          <path
            d="M0,68 C320,136 695,156 1035,102
               C1215,73 1335,44 1440,28
               L1440,150 L0,150 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;