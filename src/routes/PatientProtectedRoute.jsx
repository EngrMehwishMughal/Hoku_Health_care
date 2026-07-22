import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

const PatientProtectedRoute = () => {
  const location = useLocation();

  const token =
    localStorage.getItem(
      "patient-token"
    );

  if (!token) {
    return (
      <Navigate
        to="/patient/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};

export default PatientProtectedRoute;