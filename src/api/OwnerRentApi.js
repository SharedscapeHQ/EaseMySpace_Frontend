import axios from "axios";

const BASE_URL = "https://api.easemyspace.in/api/admin/rent-payments";

const config = {
  withCredentials: true,
};

// export const fetchFilledProperties = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/filled-properties`, config);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching filled properties:", err);
//     throw err;
//   }
// };

// export const fetchPropertyOwner = async (propertyId) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/property/${propertyId}/owner`, config);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching property owner:", err);
//     throw err;
//   }
// };

// export const fetchPropertyTenants = async (propertyId) => {
//   try {
//     const res = await axios.get(`${BASE_URL}/property/${propertyId}/tenants`, config);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching property tenants:", err);
//     throw err;
//   }
// };

// export const fetchAllRentPayments = async () => {
//   try {
//     const res = await axios.get(`${BASE_URL}/rent-payments`, config);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching rent payments:", err);
//     throw err;
//   }
// };

export const fetchAllRentPayments = async () => {
  try {
    const response = await axios.get(BASE_URL, config);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching rent payments:", error.response?.data || error.message);
    throw error;
  }
};
