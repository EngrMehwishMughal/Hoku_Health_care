import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import OurServices from "@/components/home/OurServices";
import AvailabilitySection from "@/components/home/AvailabilitySection";
import ClientReviews from "@/components/home/ClientReviews";
import GetInTouch from "@/components/home/GetInTouch";


const Home = () => {
  return (
    <>
      <Hero />
      <AboutSection />
      <OurServices />
      <AvailabilitySection />
      <ClientReviews />
      <GetInTouch />
    </>
  );
};

export default Home;