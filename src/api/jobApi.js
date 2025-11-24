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


export const applyForJob = async (applicationData) => {
    
  const formData = new FormData();
  formData.append("name", applicationData.name);
  formData.append("role", applicationData.role);
  formData.append("email", applicationData.email);
  formData.append("phone", applicationData.phone);

  if (applicationData.resume) {
    formData.append("resume", applicationData.resume);
  }
  if (applicationData.audio) {
    formData.append("audio", applicationData.audio);
  }

  const res = await jobAxios.post("/apply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export default jobAxios;
