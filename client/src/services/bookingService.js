import api from "./api";

export const getAvailability = async (id, date) => {
const response = await api.get(`/turfs/${id}/availability?date=${date}`);
return response.data;
};

export const createBooking = async (data) => {
const response = await api.post("/bookings", data);
return response.data;
};

export const getMyBookings = async () => {
const response = await api.get("/bookings/my");
return response.data;
};




export const getVendorBookings = async () => {
const response = await api.get("/bookings/vendor");
return response.data;
};

export const cancelBooking = async (id) => {
const response = await api.patch(`/bookings/${id}/cancel`);
return response.data;
};
