import axios from "axios";

// Axios instance for admin job-related APIs
const jobAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin/job",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 GET all jobs (admin only)
export const getAllJobs = async () => {
  const res = await jobAxios.get("/all");
  return res.data;
};

// 🔹 GET single job details by ID (admin only)
export const getJobDetails = async (jobId) => {
  const res = await jobAxios.get(`/${jobId}`);
  return res.data;
};

// 🔹 POST add a new job (admin only)
export const addJob = async (jobData) => {
  const res = await jobAxios.post("/add", jobData);
  return res.data;
};

// 🔹 PUT update an existing job (admin only)
export const updateJob = async (jobId, jobData) => {
  const res = await jobAxios.put(`/${jobId}/update`, jobData);
  return res.data;
};

// 🔹 DELETE a job by ID (admin only)
export const deleteJob = async (jobId) => {
  const res = await jobAxios.delete(`/${jobId}/delete`);
  return res.data;
};

export default jobAxios;
