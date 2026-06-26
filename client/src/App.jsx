import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageTurfs from "./pages/ManageTurfs";

import Home from "./pages/Home";
import Turfs from "./pages/Turfs";
import TurfDetails from "./pages/TurfDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";

import MyBookings from "./pages/MyBookings";
import PendingTurfs from "./pages/PendingTurfs";

import VendorBookings from "./pages/VendorBookings";
import VendorDashboard from "./pages/VendorDashboard";
import MyTurfs from "./pages/MyTurfs";
import AddTurf from "./pages/AddTurf";
import EditTurf from "./pages/EditTurf";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="pt-20 min-h-screen bg-[#080f0a]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/turfs/:id" element={<TurfDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/vendor/dashboard"
  element={<VendorDashboard />}
/>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route
  path="/vendor/bookings"
  element={<VendorBookings />}
/>
<Route
  path="/vendor/turfs"
  element={<MyTurfs />}
/>

<Route
  path="/vendor/add-turf"
  element={<AddTurf />}
/>

<Route path="/vendor/edit/:id" element={<EditTurf />} />
<Route
  path="/admin/manage-turfs"
  element={<ManageTurfs />}
/>

<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/pending-turfs"
  element={<PendingTurfs />}
/>

{/* <Route
  path="/admin/users"
  element={<ManageUsers />}
/> */}
<Route path="/about" element={<About />} />

<Route
  path="/admin/users"
  element={<ManageUsers />}
/>



        </Routes>
      </main>

      <Footer />
    </>
  );
}