import axios from "axios";

// Axios instance for admin-related API requests
const adminAxios = axios.create({
  baseURL: "https://api.easemyspace.in/api/admin",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json", 
  },
});

// 🔹 GET all users (admin-only)
export const getAllUsers = () => {
  return adminAxios.get("/users");
};
export const getAllLeads = () => {
  return axios.get("https://api.easemyspace.in/api/leads/All", {
    withCredentials: true, 
  });
};

export const markFollowUp = ({ leadId, remark }) => {
  return axios.post(
    "https://api.easemyspace.in/api/leads/mark-followup",
    {
      leadId,
      remark,
    },
    {
      withCredentials: true,
    }
  );
};


// 🔹 GET all properties (admin-only)
export const getAllProperties = () => {
  return adminAxios.get("/properties");
};

// 🔹 GET property details by ID
export const getPropertyDetails = (id) => {
  return adminAxios.get(`/properties/${id}`);
};

// 🔹 PUT approve a property by ID
export const approveProperty = (id) => {
  return adminAxios.put(`/properties/${id}/approve`);
};

// Edit property with full URL and cookies
export const editProperty = (id, data) => {
  return axios.put(
    `https://api.easemyspace.in/api/properties/edit-property/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// Delete property with full URL and cookies
export const deleteProperty = (id) => {
  return axios.delete(`https://api.easemyspace.in/api/properties/${id}`, {
    withCredentials: true, // cookies sent automatically
  });
};

export const markNewlyListed = async (id, isNewlyListed, position) => {
  return await adminAxios.patch(`/properties/${id}/newly-listed`, {
    is_newly_listed: isNewlyListed,
    newly_listed_position: position !== null ? Number(position) : null,
  });
};

export const fetchAllEditQueries = () => {
  return adminAxios.get("/queries/all");
};

export const fetchPendingQueries = () => {
  return adminAxios.get("/edit-queries");
};

export const resolveEditQuery = (id, ownerCode) => {
  return adminAxios.patch(`/edit-queries/${id}/resolve`, {
    owner_code: ownerCode,
  });
};

// 🔹 GET all locations (admin/owner access)
export const getAllLocations = () => {
  return adminAxios.get("/locations/all");
};

// 🔹 POST add a new location (admin only)
export const addLocation = (payload) => {
  return adminAxios.post("/locations", payload);
};

// 🔹 DELETE a location by ID (admin only)
export const deleteLocation = (id) => {
  return adminAxios.delete(`/locations/${id}`);
};

export const sendSMS = (recipient, message) => {
  return adminAxios.post("/sendSMS", { recipient, message });
};

export const getAllLandlordAgents = () => {
  return adminAxios.get("/landlord-agents");
};

export const updateLandlordAgentVerification = (id, verified) => {
  return adminAxios.patch(`/landlord-agents/${id}/verify`, { verified });
};

export const getAllAccountAssignments = () => {
  return adminAxios.get("/assignments");
};

export const getAllLandlordsLedgerSummary = () => {
  return adminAxios.get("/landlord-ledger-summary");
};

export const getAllComplaints = () => {
  return adminAxios.get("/complaints");
};

export const resolveComplaint = (id) => {
  return adminAxios.patch(`/complaints/${id}/resolve`);
};

export const getAllSalesInquiries = () => {
  return adminAxios.get("/sales-inquiries");
};

export const updateSalesInquiry = (id, data) => {
  return adminAxios.patch(`/sales-inquiries/${id}/action`, data);
};

export const getAllPropertyReports = () => {
  return adminAxios.get("/property-reports");
};

export const resolvePropertyReport = (id, data) => {
  return adminAxios.patch(`/property-reports/${id}/resolve`, data);
};

export const getAllPostRequests = () => {
  return adminAxios.get("/post-requests");
};

export const handlePostRequest = (id, action) => {
  return adminAxios.patch(`/post-requests/${id}/action`, {
    action, 
  });
};

export const adminUploadKycForm = (formData) => {
  return adminAxios.post("/kyc/upload", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
};

export const getUserKYCDocs = (userId) => {
  return adminAxios.get(`/kyc-docs/${userId}`);
};


