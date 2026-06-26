import api from "./api";

// =========================
// Public
// =========================

export const getAllTurfs = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.sport) params.append("sport", filters.sport);
  if (filters.location) params.append("location", filters.location);

  const query = params.toString();

  const response = await api.get(`/turfs${query ? `?${query}` : ""}`);
  return response.data;
};

export const getFeaturedTurfs = async () => {
  const response = await api.get("/turfs/featured");
  return response.data;
};

export const getSingleTurf = async (id) => {
  const response = await api.get(`/turfs/${id}`);
  return response.data;
};

// =========================
// Vendor
// =========================

export const getVendorTurfs = async () => {
  const response = await api.get("/turfs/vendor/my");
  return response.data;
};

export const createTurf = async (formData) => {
  const response = await api.post("/turfs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateTurf = async (id, formData) => {
  const response = await api.put(`/turfs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteTurf = async (id) => {
  const response = await api.delete(`/turfs/${id}`);
  return response.data;
};