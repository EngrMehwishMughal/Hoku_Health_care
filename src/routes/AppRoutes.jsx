import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/HomePage";
import Services from "@/pages/ServicesPage";
import ServiceDetailsPage from "@/pages/ServiceDetailsPage";
import Contact from "@/pages/ContactPage";
import Specialists from "@/pages/SpecialistsPage";
const AppRoutes = () => {
  return (
    <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route
  path="/services/:slug"
  element={<ServiceDetailsPage />}
/>
<Route path="/contact" element={<Contact />} />
<Route path="/specialists" element={<Specialists />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;