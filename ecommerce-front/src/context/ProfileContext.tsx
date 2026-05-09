import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/apiClient";
import { PROFILE_IMAGE_CACHE_KEY } from "../constants";

interface ProfileContextType {
  profileImage: string;
  setProfileImage: (url: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profileImage: "",
  setProfileImage: () => {},
});

export const useProfile = () => useContext(ProfileContext);

// Read cached image synchronously to avoid a flash of the default avatar.
const getInitialImage = (): string => {
  try {
    const cached = localStorage.getItem(PROFILE_IMAGE_CACHE_KEY);
    // Discard old storage-path URLs that are no longer valid.
    if (cached && cached.includes("/storage/") && !cached.startsWith("data:")) {
      localStorage.removeItem(PROFILE_IMAGE_CACHE_KEY);
      return "";
    }
    return cached || "";
  } catch {
    return "";
  }
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profileImage, setProfileImageState] = useState<string>(getInitialImage);

  // Guard against re-fetching on every navigation.
  const hasFetched = useRef(false);

  const setProfileImage = (url: string) => {
    if (url) {
      localStorage.setItem(PROFILE_IMAGE_CACHE_KEY, url);
    } else {
      localStorage.removeItem(PROFILE_IMAGE_CACHE_KEY);
    }
    setProfileImageState(url);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Skip if not logged in, already have an image, or already fetched.
    if (!token || profileImage || hasFetched.current) return;

    hasFetched.current = true;

    api
      .get("/me")
      .then((res) => {
        if (res.data.profile_image) {
          setProfileImage(res.data.profile_image);
        }
      })
      .catch(() => {
        // Silently ignore — the user will still see the default avatar.
      });
  }, []);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};