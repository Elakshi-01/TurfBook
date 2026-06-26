import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTurf } from "../services/turfService";

export default function AddTurf() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    sports: "",
    openTime: "06:00",
    closeTime: "23:00",
    pricePerSlot: "",
  });

  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      for (let i = 0; i < photos.length; i++) {
        data.append("photos", photos[i]);
      }

      await createTurf(data);

      alert("Turf Added Successfully");

      navigate("/vendor/turfs");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to create turf"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <div className="max-w-3xl mx-auto bg-[#12221a] p-8 rounded-xl">

        <h1 className="text-4xl font-bold text-emerald-400 mb-8">
          Add Turf
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="name"
            placeholder="Turf Name"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <input
            name="sports"
            placeholder="football,cricket,badminton"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="time"
              name="openTime"
              value={form.openTime}
              onChange={handleChange}
              className="p-3 rounded bg-[#1c2d24]"
            />

            <input
              type="time"
              name="closeTime"
              value={form.closeTime}
              onChange={handleChange}
              className="p-3 rounded bg-[#1c2d24]"
            />

          </div>

          <input
            type="number"
            name="pricePerSlot"
            placeholder="Price Per Slot"
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1c2d24]"
          />

          <input
            type="file"
            multiple
            onChange={(e) =>
              setPhotos(e.target.files)
            }
          />

          <button className="w-full bg-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-600">
            Add Turf
          </button>

        </form>

      </div>
    </div>
  );
}