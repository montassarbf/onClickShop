import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";

interface ProfileContextType {
  profileImage: string;
  setProfileImage: (url: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profileImage: "",
  setProfileImage: () => {},
});

export const useProfile = () => useContext(ProfileContext);

const CACHE_KEY = "profile_image_url";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string>(
    () => localStorage.getItem(CACHE_KEY) || ""
  );

  const setProfileImage = (url: string) => {
    if (url) {
      localStorage.setItem(CACHE_KEY, url);
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
    setProfileImageState(url);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return;

    api.get("/me")
      .then((res) => {
        if (res.data.profile_image) {
          // ✅ base64 or full URL — use directly
          setProfileImage(res.data.profile_image);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};