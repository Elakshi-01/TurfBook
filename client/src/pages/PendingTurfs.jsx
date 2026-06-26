import { useEffect, useState } from "react";
import {
  getPendingTurfs,
  approveTurf,
  rejectTurf,
} from "../services/adminService";

export default function PendingTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfs();
  }, []);

const fetchTurfs = async () => {
  try {
    const res = await getPendingTurfs();
setTurfs(res.turfs);  
  } catch (err) {
    console.error(err);
    alert("Failed to load pending turfs");
  } finally {
    setLoading(false);
  }
};

  const handleApprove = async (id) => {
    try {
      await approveTurf(id);
      alert("Turf Approved");
      fetchTurfs();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

const handleReject = async (id) => {
  if (!window.confirm("Reject this turf?")) return;

  try {
    console.log("Rejecting:", id);

    const res = await rejectTurf(id);

    console.log(res);

    alert("Turf Rejected");

    fetchTurfs();
  } catch (err) {
    console.log(err.response);
    console.log(err.response?.data);

    alert(err.response?.data?.message || "Reject failed");
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
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          Pending Turf Approvals
        </h1>

        {turfs.length === 0 ? (
          <div className="bg-[#12221a] rounded-xl p-8">
            No Pending Turfs
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">

            {turfs.map((turf) => (
              <div
                key={turf._id}
                className="bg-[#12221a] rounded-xl overflow-hidden"
              >
                <img
                  src={
                    turf.photos?.length
                      ? turf.photos[0]
                      : "https://placehold.co/600x400?text=TurfBook"
                  }
                  alt={turf.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-3xl font-bold">
                    {turf.name}
                  </h2>

                 <p className="mt-2 text-gray-300">
  📍 {turf.city}
</p>

<p className="mt-2">
  {turf.address}
</p>

<hr className="my-4 border-gray-700" />

<p>
  <strong>Vendor:</strong> {turf.vendorId?.name}
</p>

<p>
  <strong>Email:</strong> {turf.vendorId?.email}
</p>

<p>
  <strong>Phone:</strong> {turf.vendorId?.phone}
</p>

<p className="mt-3">
  <strong>Sports:</strong> {turf.sports.join(", ")}
</p>

                  <p className="text-emerald-400 text-xl font-bold mt-3">
                    ₹{turf.pricePerSlot}
                  </p>

                  <div className="flex gap-4 mt-6">

                    <button
                      onClick={() => handleApprove(turf._id)}
                      className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(turf._id)}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}