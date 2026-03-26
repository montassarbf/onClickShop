import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { useProfile } from "../context/ProfileContext";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { profileImage, setProfileImage } = useProfile();

  const [emailNotifs, setEmailNotifs]   = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promos, setPromos]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [preview, setPreview]     = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);
    setUploading(true);
    setUploadMsg(null);

    try {
      const res = await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Construire l'URL complète
      const path = res.data.profile_image;
      const fullUrl = path.startsWith("http")
        ? path
        : `http://onclickshop.onrender.com/storage/${path}`;

      // ✅ Mettre à jour le context → la Navbar se met à jour instantanément
      setProfileImage(fullUrl);
      setPreview(fullUrl);
      setUploadMsg({ text: "Photo updated successfully!", ok: true });
    } catch {
      setUploadMsg({ text: "Failed to upload photo. Please try again.", ok: false });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-orange-500 mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          <span className="text-orange-400">Settings</span>
        </h1>
        <p className="text-gray-600 mb-10">Notifications and preferences.</p>

        <div className="space-y-6">

          {/* PROFILE PHOTO */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Profile Photo</h2>

            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl ring-4 ring-orange-100 overflow-hidden bg-gray-100">
                  <img
                    src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=profile"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium mb-1">Upload a new photo</p>
                <p className="text-xs text-gray-400 mb-4">JPG, PNG or WEBP — max 2 MB</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-wrap gap-2 ">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 btn btn-sm btn-outline border-orange-400 text-orange-500 hover:bg-orange-50"
                  >
                    Choose file
                  </button>

                  {preview && (
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-0 disabled:opacity-60 p-2"
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2 p-2">
                          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Uploading…
                        </span>
                      ) : "Save photo"}
                    </button>
                  )}

                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setUploadMsg(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="btn btn-sm btn-ghost text-gray-400 hover:text-red-400 p-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {uploadMsg && (
                  <p className={`text-xs mt-3 font-medium ${uploadMsg.ok ? "text-green-600" : "text-red-500"}`}>
                    {uploadMsg.text}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            <label className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 cursor-pointer">
              <span className="text-gray-700">Email notifications</span>
              <input type="checkbox" className="toggle toggle-warning text-orange-400 border-gray-100 border-gray-50 border-2" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 cursor-pointer">
              <span className="text-gray-700">Order & shipping updates</span>
              <input type="checkbox" className="toggle toggle-warning text-orange-400 border-gray-100 border-gray-50 border-2" checked={orderUpdates} onChange={(e) => setOrderUpdates(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
              <span className="text-gray-700">Promotions & deals</span>
              <input type="checkbox" className="toggle toggle-warning text-orange-400 border-gray-100 border-gray-50 border-2" checked={promos} onChange={(e) => setPromos(e.target.checked)} />
            </label>
          </div>

          {/* ACCOUNT */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <p className="text-sm text-gray-600 mb-4">Password changes and security options can be wired to your API when available.</p>
            <button type="button" className="btn btn-outline btn-sm border-gray-300" disabled>
              Change password (soon)
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn bg-orange-500 hover:bg-orange-600 text-white border-0 p-5" onClick={handleSave}>
              Save preferences
            </button>
            {saved && <span className="text-sm text-green-600 self-center">Preferences saved.</span>}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Settings;