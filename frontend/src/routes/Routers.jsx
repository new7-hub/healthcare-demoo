import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import DoctorList from "../components/Doctors/DoctorList";
import MyAccount from "../Dashboard/user-account/MyAccount";
import DoctorDashboard from "../Dashboard/doctor-account/Dashboard";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const Protected = ({ children, role }) => {
  const { token, role: currentRole } = useContext(authContext);
  if (!token) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/home" replace />;
  return children;
};

const Routers = () => <Routes>
  <Route path="/" element={<Navigate to="/home" replace />} />
  <Route path="/home" element={<Home />} />
  <Route path="/doctors" element={<DoctorList />} />
  <Route path="/doctors/:id" element={<DoctorDetails />} />
  <Route path="/doctors/profile/me" element={<Protected role="doctor"><DoctorDashboard /></Protected>} />
  <Route path="/users/profile/me" element={<Protected role="patient"><MyAccount /></Protected>} />
  <Route path="/services" element={<Services />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Signup />} />
  <Route path="/checkout-success" element={<Protected role="patient"><CheckoutSuccess /></Protected>} />
  <Route path="*" element={<Navigate to="/home" replace />} />
</Routes>;
export default Routers;
