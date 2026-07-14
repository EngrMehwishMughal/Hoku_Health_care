import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
  } from "react-icons/fa";
  
  const contactItems = [
    {
      id: 1,
      icon: <FaPhoneAlt />,
      title: "Phone",
      value: "512-258-789",
      href: "tel:512258789",
    },
    {
      id: 2,
      icon: <FaEnvelope />,
      title: "Email",
      value: "info@hokuhealth.com",
      href: "mailto:info@hokuhealth.com",
    },
    {
      id: 3,
      icon: <FaMapMarkerAlt />,
      title: "Address",
      value: "7537 Wiza Valley, Missouri",
      href: null,
    },
    {
      id: 4,
      icon: <FaClock />,
      title: "Availability",
      value: "24 Hours, 7 Days a Week",
      href: null,
    },
  ];
  
  const ContactInfo = () => {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {contactItems.map((item) => {
          const content = (
            <article className="h-full rounded-2xl border border-[var(--border)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                {item.icon}
              </div>
  
              <h3 className="mt-5 text-lg font-bold text-[var(--heading)]">
                {item.title}
              </h3>
  
              <p className="mt-2 leading-7 text-[var(--body)]">{item.value}</p>
            </article>
          );
  
          return item.href ? (
            <a key={item.id} href={item.href}>
              {content}
            </a>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
    );
  };
  
  export default ContactInfo;