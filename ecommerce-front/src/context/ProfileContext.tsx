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
  // ✅ Lire IMMÉDIATEMENT depuis localStorage — 0ms, pas de reload
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

    // ✅ Si image déjà en cache → NE PAS appeler /me du tout
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return;

    // Seulement si pas de cache → fetch en arrière-plan
    api.get("/me")
      .then((res) => {
        if (res.data.profile_image) {
          const img = res.data.profile_image.startsWith("http")
            ? res.data.profile_image
            : `http://127.0.0.1:8000/storage/${res.data.profile_image}`;
          setProfileImage(img);
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