import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

type Me = {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get<Me>("/me");
        setUser(res.data);
      } catch {
        setError("Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avatarUrl = user?.profile_image
    ? user.profile_image.startsWith("http")
      ? user.profile_image
      : `http://127.0.0.1:8000/storage/${user.profile_image.replace(/^\//, "")}`
    : "https://api.dicebear.com/7.x/avataaars/svg?seed=profile";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Loading profile…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600">{error || "Something went wrong."}</p>
        <button type="button" className="btn bg-orange-500 text-white p-2" onClick={() => navigate("/login")}>
          Go to login
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Your <span className="text-orange-400">Profile</span>
        </h1>
        <p className="text-gray-600 mb-10">Manage how you appear on Onclick Shop.</p>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-orange-400 to-amber-400" />
          <div className="px-6 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-lg overflow-hidden bg-gray-100 shrink-0">
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pt-2 sm:pb-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <button
                type="button"
                className="btn btn-outline border-orange-400 text-orange-500 hover:bg-orange-50"
                onClick={() => navigate("/settings")}
              >
                Edit settings
              </button>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">User ID</dt>
                <dd className="mt-1 text-gray-900 font-medium">{user.id}</dd>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Account</dt>
                <dd className="mt-1 text-gray-900 font-medium">Active</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
