import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const Profile = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [],
    experiences: [],
    timeSlots: [],
    about: "",
    photo: null,
  });

  useEffect(() => {
    setFormData({
      name: doctorData?.name ?? "",
      email: doctorData?.email ?? "",
      password: "",
      phone: doctorData?.phone ?? "",
      bio: doctorData?.bio ?? "",
      gender: doctorData?.gender ?? "",
      specialization: doctorData?.specialization ?? "",
      ticketPrice: doctorData?.ticketPrice ?? 0,
      qualifications: Array.isArray(doctorData?.qualifications)
        ? doctorData.qualifications.map((item) => ({
            startingDate: item?.startingDate ?? "",
            endingDate: item?.endingDate ?? "",
            degree: item?.degree ?? "",
            university: item?.university ?? "",
          }))
        : [],
      experiences: Array.isArray(doctorData?.experiences)
        ? doctorData.experiences.map((item) => ({
            startingDate: item?.startingDate ?? "",
            endingDate: item?.endingDate ?? "",
            position: item?.position ?? "",
            hospital: item?.hospital ?? "",
          }))
        : [],
      timeSlots: Array.isArray(doctorData?.timeSlots)
        ? doctorData.timeSlots.map((item) => ({
            day: item?.day ?? "",
            startingTime: item?.startingTime ?? "",
            endingTime: item?.endingTime ?? "",
          }))
        : [],
      about: doctorData?.about ?? "",
      photo: doctorData?.photo ?? null,
    });
  }, [doctorData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "ticketPrice" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadImageToCloudinary(file);
      const photoUrl = data?.secure_url || data?.url;

      if (!photoUrl) {
        throw new Error("Image upload failed. Please try again.");
      }

      setFormData((prev) => ({ ...prev, photo: photoUrl }));
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to upload photo");
    } finally {
      event.target.value = "";
    }
  };

  const updateProfileHandler = async (event) => {
    event.preventDefault();

    if (!doctorData?._id) {
      toast.error("Doctor profile ID is missing. Please refresh and try again.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(result?.message || `Profile update failed (${response.status}).`);
      }

      toast.success(result?.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Unable to update profile");
    }
  };

  const addItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(Array.isArray(prev[key]) ? prev[key] : []), item],
    }));
  };

  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const items = Array.isArray(prev[key]) ? prev[key] : [];

      return {
        ...prev,
        [key]: items.map((item, itemIndex) => {
          if (itemIndex !== index) return item;

          // Normalize malformed legacy entries instead of assigning into a string/null.
          const current = item && typeof item === "object" ? item : {};
          return { ...current, [name]: value };
        }),
      };
    });
  };

  const deleteItem = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (Array.isArray(prev[key]) ? prev[key] : []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const addQualification = (event) => {
    event.preventDefault();
    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "",
      university: "",
    });
  };

  const handleQualificationChange = (event, index) => {
    handleReusableInputChangeFunc("qualifications", index, event);
  };

  const deleteQualification = (event, index) => {
    event.preventDefault();
    deleteItem("qualifications", index);
  };

  const addExperience = (event) => {
    event.preventDefault();
    addItem("experiences", {
      startingDate: "",
      endingDate: "",
      position: "",
      hospital: "",
    });
  };

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc("experiences", index, event);
  };

  const deleteExperience = (event, index) => {
    event.preventDefault();
    deleteItem("experiences", index);
  };

  const addTimeSlot = (event) => {
    event.preventDefault();
    addItem("timeSlots", {
      day: "",
      startingTime: "",
      endingTime: "",
    });
  };

  const handleTimeSlotChange = (event, index) => {
    handleReusableInputChangeFunc("timeSlots", index, event);
  };

  const deleteTimeSlot = (event, index) => {
    event.preventDefault();
    deleteItem("timeSlots", index);
  };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>

      <form onSubmit={updateProfileHandler}>
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Email*</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            className="form__input"
            readOnly
            disabled
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Phone*</p>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Bio*</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
            maxLength={100}
          />
        </div>

        <div className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Gender*</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <p className="form__label">Specialization*</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="surgeon">Surgeon</option>
                <option value="neurologist">Neurologist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>

            <div>
              <p className="form__label">Ticket Price*</p>
              <input
                type="number"
                min="0"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleInputChange}
                placeholder="100"
                className="form__input"
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="form__label">Qualifications*</p>
          {formData.qualifications.map((item, index) => (
            <div key={`qualification-${index}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Starting Date*</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item?.startingDate ?? ""}
                    className="form__input"
                    onChange={(event) => handleQualificationChange(event, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date*</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item?.endingDate ?? ""}
                    className="form__input"
                    onChange={(event) => handleQualificationChange(event, index)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form__label">Degree*</p>
                  <input
                    type="text"
                    name="degree"
                    value={item?.degree ?? ""}
                    className="form__input"
                    onChange={(event) => handleQualificationChange(event, index)}
                  />
                </div>
                <div>
                  <p className="form__label">University*</p>
                  <input
                    type="text"
                    name="university"
                    value={item?.university ?? ""}
                    className="form__input"
                    onChange={(event) => handleQualificationChange(event, index)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => deleteQualification(event, index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
                aria-label="Delete qualification"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addQualification}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Qualification
          </button>
        </div>

        <div className="mb-5">
          <p className="form__label">Experiences*</p>
          {formData.experiences.map((item, index) => (
            <div key={`experience-${index}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Starting Date*</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item?.startingDate ?? ""}
                    className="form__input"
                    onChange={(event) => handleExperienceChange(event, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date*</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item?.endingDate ?? ""}
                    className="form__input"
                    onChange={(event) => handleExperienceChange(event, index)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form__label">Position*</p>
                  <input
                    type="text"
                    name="position"
                    value={item?.position ?? ""}
                    className="form__input"
                    onChange={(event) => handleExperienceChange(event, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Hospital*</p>
                  <input
                    type="text"
                    name="hospital"
                    value={item?.hospital ?? ""}
                    className="form__input"
                    onChange={(event) => handleExperienceChange(event, index)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => deleteExperience(event, index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
                aria-label="Delete experience"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Experience
          </button>
        </div>

        <div className="mb-5">
          <p className="form__label">Time Slots*</p>
          {formData.timeSlots.map((item, index) => (
            <div key={`time-slot-${index}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 mb-[30px] gap-5">
                <div>
                  <p className="form__label">Day*</p>
                  <select
                    name="day"
                    value={item?.day ?? ""}
                    className="form__input py-3.5"
                    onChange={(event) => handleTimeSlotChange(event, index)}
                  >
                    <option value="">Select</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                  </select>
                </div>

                <div>
                  <p className="form__label">Starting Time*</p>
                  <input
                    type="time"
                    name="startingTime"
                    value={item?.startingTime ?? ""}
                    className="form__input"
                    onChange={(event) => handleTimeSlotChange(event, index)}
                  />
                </div>

                <div>
                  <p className="form__label">Ending Time*</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item?.endingTime ?? ""}
                    className="form__input"
                    onChange={(event) => handleTimeSlotChange(event, index)}
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(event) => deleteTimeSlot(event, index)}
                    className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer mt-6"
                    aria-label="Delete time slot"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTimeSlot}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add TimeSlot
          </button>
        </div>

        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder="Write about yourself..."
            onChange={handleInputChange}
            className="form__input"
          />
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img
                src={formData.photo}
                alt="Doctor profile"
                className="w-full rounded-full"
              />
            </figure>
          )}

          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg,.jpeg,.png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            className="bg-primaryColor text-white text-[18px] loading-[30px] w-full py-3 px-4 rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
