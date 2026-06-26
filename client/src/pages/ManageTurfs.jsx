import { useEffect, useState } from "react";
import {
  getAllTurfs,
  approveTurf,
  rejectTurf,
  deactivateTurf,
} from "../services/adminService";

export default function ManageTurfs() {
  const [turfs, setTurfs] = useState([]);

  const fetchTurfs = async () => {
    try {
      const res = await getAllTurfs();
      setTurfs(res.turfs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  return (
    <div className="min-h-screen bg-[#08120c] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-emerald-400 mb-10">
          Manage Turfs
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {turfs.map((turf) => (

            <div
              key={turf._id}
              className="bg-[#12221a] rounded-xl overflow-hidden"
            >

              <img
                src={
                  turf.photos.length
                    ? turf.photos[0]
                    : "https://placehold.co/600x400"
                }
                className="h-56 w-full object-cover"
              />

              <div className="p-6">

                <h2 className="text-3xl font-bold">
                  {turf.name}
                </h2>

                <p className="mt-2">
                  Vendor :
                  {" "}
                  {turf.vendorId?.name}
                </p>

                <p>
                  {turf.city}
                </p>

                <p>
                  {turf.sports.join(", ")}
                </p>

                <p className="mt-4">
                  Status :
                  {" "}
                  <span className="text-yellow-400">
                    {turf.status}
                  </span>
                </p>

                <p>
                  Active :
                  {" "}
                  {turf.isActive ? "Yes" : "No"}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">

                  <button
                    onClick={async () => {
                      await approveTurf(turf._id);
                      fetchTurfs();
                    }}
                    className="bg-green-600 px-4 py-2 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={async () => {
                      await rejectTurf(turf._id);
                      fetchTurfs();
                    }}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Reject
                  </button>

                  <button
                    onClick={async () => {
                      await deactivateTurf(turf._id);
                      fetchTurfs();
                    }}
                    className="bg-orange-600 px-4 py-2 rounded"
                  >
                    Deactivate
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}