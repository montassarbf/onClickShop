import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

// ✅ Read cache ONCE outside component — instant, synchronous, no re-render
const getInitialImage = (): string => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    // Clear old broken storage URLs
    if (cached && cached.includes("/storage/") && !cached.startsWith("data:")) {
      localStorage.removeItem(CACHE_KEY);
      return "";
    }
    return cached || "";
  } catch {
    return "";
  }
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string>(getInitialImage);
  // ✅ Track if we already fetched — prevents re-fetch on navigation
  const hasFetched = useRef(false);

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

    // ✅ If image already in state (from cache) — NEVER fetch again
    if (profileImage) return;

    // ✅ If already fetched this session — NEVER fetch again
    if (hasFetched.current) return;
    hasFetched.current = true;

    api.get("/me")
      .then((res) => {
        if (res.data.profile_image) {
          setProfileImage(res.data.profile_image);
        }
      })
      .catch(() => {});
  }, []); // ✅ Empty deps — runs ONCE only, never on navigation

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};