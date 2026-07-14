const ContactMap = () => {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
        <iframe
          title="HOKU Health Care Location"
          src="https://www.google.com/maps?q=7537%20Wiza%20Valley%20Missouri&output=embed"
          className="h-[380px] w-full border-0 sm:h-[440px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  };
  
  export default ContactMap;