import axios from "axios";

const BASE_URL = "https://api.easemyspace.in/api/leads";

export const updateLeadUserProfile = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/lead-user/update-profile`, data, { timeout: 10000 });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to update lead user profile:", err.response?.data || err.message);
    throw err;
  }
};

export const finalizeRegistration = async (phone) => {
  try {
    const res = await axios.post(`${BASE_URL}/lead-user/finalize-registration`, { phone }, { timeout: 10000 });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to finalize registration:", err.response?.data || err.message);
    throw err;
  }
};

export const fetchLeadUserProfile = async (phone) => {
  try {
    const res = await axios.get(`${BASE_URL}/lead-user/profile`, {
      params: { phone },
      timeout: 10000,
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to fetch lead user profile:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const fetchGuestSubscriptions = async (phone) => {
  try {
    const res = await axios.get(`${BASE_URL}/guest-subscriptions`, {
      params: { phone },
      timeout: 10000,
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to fetch guest subscriptions:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const fetchGuestUnlockedContacts = async (phone) => {
  try {
    const res = await axios.get(`${BASE_URL}/guest-unlocked-contacts`, {
      params: { phone },
      timeout: 10000,
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Failed to fetch guest unlocked contacts:",
      err.response?.data || err.message
    );
    throw err;
  }
};