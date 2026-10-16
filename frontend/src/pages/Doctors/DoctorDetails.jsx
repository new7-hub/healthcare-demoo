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

  const {
    data: doctor,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/doctors/${id}`);

  const book = async () => {
    if (!user) {
      return toast.info("Please login as a patient to book an appointment");
    }

    if (role !== "patient") {
      return toast.error("Only patients can book appointments");
    }

    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Could not start checkout");
      }

      window.location.href = result.session.url;
    } catch (err) {
      toast.error(err.message || "Could not start checkout");
    }
  };

  if (loading) return <Loader />;

  if (error || !doctor) {
    return (
      <section className="container py-10 text-center">
        <p>{error || "Doctor not found"}</p>
      </section>
    );
  }

  // Safely handle missing or invalid time-slot data.
  const timeSlots = Array.isArray(doctor.timeSlots)
    ? doctor.timeSlots.filter(
        (slot) =>
          slot &&
          typeof slot === "object" &&
          (slot.day || slot.startingTime || slot.endingTime)
      )
    : [];

  return (
    <section className="py-10">
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor photo and booking button */}
          <div>
            <img
              src={doctor.photo || "/images/default-avatar.png"}
              alt={doctor.name || "Doctor"}
              className="w-full rounded-lg"
            />

            <div className="mt-5">
              <button onClick={book} className="btn w-full">
                Book Appointment — ₹{doctor.ticketPrice || 0}
              </button>

              {!user && (
                <Link
                  className="block text-center mt-3 text-primaryColor"
                  to="/login"
                >
                  Login to book
                </Link>
              )}
            </div>
          </div>

          {/* Doctor information */}
          <div className="lg:col-span-2">
            <span className="bg-[#CCF0F3] px-4 py-2 rounded">
              {doctor.specialization || "Doctor"}
            </span>

            <h1 className="text-3xl font-bold mt-4">{doctor.name}</h1>

            <p className="mt-3 text-textColor">
              Rating: {doctor.averageRating || 0} (
              {doctor.totalRating || 0} reviews)
            </p>

            <DoctorsAbout
              name={doctor.name}
              about={doctor.about}
              qualifications={doctor.qualifications}
              experiences={doctor.experiences}
            />

            {/* Available time slots */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Available Time Slots
              </h2>

              {timeSlots.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot._id || index}
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <h3 className="font-semibold text-lg capitalize">
                        {slot.day || "Day not specified"}
                      </h3>

                      <p className="mt-2 text-textColor">
                        {formatTime(slot.startingTime)}
{" — "}
{formatTime(slot.endingTime)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-textColor">
                  No time slots have been added by this doctor yet.
                </p>
              )}
            </div>

            {/* Patient reviews */}
            {doctor.reviews?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Reviews</h3>

                <div className="space-y-4">
                  {doctor.reviews.map((review, index) => (
                    <div
                      key={review._id || index}
                      className="p-4 rounded border"
                    >
                      <b>{review.user?.name || "Patient"}</b>

                      <span className="ml-3">
                        {review.rating}/5
                      </span>

                      <p className="mt-2">{review.reviewText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
