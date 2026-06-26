import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleTurf,
  updateTurf,
} from "../services/turfService";

export default function EditTurf() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    sports: "",
    pricePerSlot: "",
    openTime: "",
    closeTime: "",
  });

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchTurf();
  }, []);

  const fetchTurf = async () => {
    try {
      const res = await getSingleTurf(id);

      const turf = res.data;

      setFormData({
        name: turf.name || "",
        description: turf.description || "",
        city: turf.city || "",
        address: turf.address || "",
        sports: turf.sports?.join(", ") || "",
        pricePerSlot: turf.pricePerSlot || "",
        openTime: turf.openTime || "",
        closeTime: turf.closeTime || "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load turf");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      for (let i = 0; i < photos.length; i++) {
        data.append("photos", photos[i]);
      }

      await updateTurf(id, data);

      alert("Turf Updated Successfully");

      navigate("/vendor/turfs");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to update turf"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#08120c] text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08120c] text-white py-10 px-6">
      <div className="max-w-3xl mx-auto bg-[#12221a] p-8 rounded-xl">

        <h1 className="text-4xl font-bold text-emerald-400 mb-8">
          Edit Turf
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Turf Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            rows={4}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            required
          />

          <input
            type="text"
            name="sports"
            placeholder="football, cricket"
            value={formData.sports}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            required
          />

          <input
            type="number"
            name="pricePerSlot"
            placeholder="Price"
            value={formData.pricePerSlot}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#1d3126]"
            required
          />

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block mb-2">
                Opening Time
              </label>

              <input
                type="time"
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                className="w-full p-3 rounded bg-[#1d3126]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">
                Closing Time
              </label>

              <input
                type="time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                className="w-full p-3 rounded bg-[#1d3126]"
                required
              />
            </div>

          </div>

          <div>

            <label className="block mb-2">
              Upload New Photos (Optional)
            </label>

            <input
              type="file"
              multiple
              onChange={handlePhotoChange}
              className="w-full"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg text-lg font-semibold"
          >
            Update Turf
          </button>

        </form>

      </div>
    </div>
  );
}