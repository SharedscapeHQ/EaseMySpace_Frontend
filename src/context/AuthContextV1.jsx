import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await getCurrentUser();
        if (me) {
          setUser({
            ...me,
            createdAt: me.created_at,
            profileImage: me.profile_image || "",
          });
          setIsVerified(localStorage.getItem("otp_verified") === "true");
        } else {
          setUser(null);
          setIsVerified(false);
        }
      } catch {
        setUser(null);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser({
      ...userData,
      createdAt: userData.created_at,
      profileImage: userData.profile_image || "",
    });
    setIsVerified(localStorage.getItem("otp_verified") === "true");
  };

  const logout = () => {
    setUser(null);
    setIsVerified(false);
  };

  return (
    <AuthContext.Provider value={{ user, isVerified, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}