import api from "./api";

export const getDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getPendingTurfs = async () => {
  const response = await api.get("/admin/turfs/pending");
  return response.data;
};

export const getAllTurfs = async () => {
  const response = await api.get("/admin/turfs");
  return response.data;
};

export const approveTurf = async (id) => {
  const response = await api.patch(`/admin/turfs/${id}/approve`);
  return response.data;
};

export const rejectTurf = async (id) => {
  const response = await api.patch(`/admin/turfs/${id}/reject`);
  return response.data;
};

export const deactivateTurf = async (id) => {
  const response = await api.patch(`/admin/turfs/${id}/deactivate`);
  return response.data;
};

export const getAllUsers = async (role = "") => {
  const response = await api.get(`/admin/users?role=${role}`);
  return response.data;
};