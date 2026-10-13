import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import { authContext } from "../../context/AuthContext";
import DoctorsAbout from "./DoctorsAbout";
import Loader from "../../components/Loader/Loading";

const DoctorDetails = () => {
  const { id } = useParams();
  const { user, role } = useContext(authContext);
  const { data: doctor, loading, error } = useFetchData(`${BASE_URL}/doctors/${id}`);

  const book = async () => {
    if (!user) return toast.info("Please login as a patient to book an appointment");
    if (role !== "patient") return toast.error("Only patients can book appointments");
    try {
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${id}`, {
        method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Could not start checkout");
      window.location.href = result.session.url;
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;
  if (error || !doctor) return <section className="container py-10 text-center"><p>{error || "Doctor not found"}</p></section>;

  return <section className="py-10"><div className="max-w-[1170px] px-5 mx-auto">
    <div className="grid lg:grid-cols-3 gap-8">
      <div><img src={doctor.photo} alt={doctor.name} className="w-full rounded-lg" /><div className="mt-5"><button onClick={book} className="btn w-full">Book Appointment — ₹{doctor.ticketPrice || 0}</button>{!user && <Link className="block text-center mt-3 text-primaryColor" to="/login">Login to book</Link>}</div></div>
      <div className="lg:col-span-2"><span className="bg-[#CCF0F3] px-4 py-2 rounded">{doctor.specialization || "Doctor"}</span><h1 className="text-3xl font-bold mt-4">{doctor.name}</h1><p className="mt-3 text-textColor">Rating: {doctor.averageRating || 0} ({doctor.totalRating || 0} reviews)</p><DoctorsAbout name={doctor.name} about={doctor.about} qualifications={doctor.qualifications} experiences={doctor.experiences}/>
      {doctor.reviews?.length > 0 && <div className="mt-8"><h3 className="text-xl font-bold mb-4">Reviews</h3><div className="space-y-4">{doctor.reviews.map(r => <div key={r._id} className="p-4 rounded border"><b>{r.user?.name || "Patient"}</b><span className="ml-3">{r.rating}/5</span><p className="mt-2">{r.reviewText}</p></div>)}</div></div>}</div>
    </div>
  </div></section>;
};
export default DoctorDetails;
