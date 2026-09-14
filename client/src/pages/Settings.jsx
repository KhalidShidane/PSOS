import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { updateProfileRequest, changePasswordRequest } from "../services/authService.js";
import ProfileForm from "../components/settings/ProfileForm.jsx";
import ChangePasswordForm from "../components/settings/ChangePasswordForm.jsx";

const Settings = () => {
  const { user, setUser } = useAuth();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordFormKey, setPasswordFormKey] = useState(0);

  const handleProfileSubmit = async (data) => {
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSaved(false);
    try {
      const updated = await updateProfileRequest(data);
      setUser(updated);
      setProfileSaved(true);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    setIsSavingPassword(true);
    setPasswordError("");
    setPasswordSaved(false);
    try {
      await changePasswordRequest(data);
      setPasswordSaved(true);
      setPasswordFormKey((k) => k + 1); // remount -> clears the fields, only on success
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile and account security.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Profile</h2>
        {profileError && <p className="mb-3 text-sm text-red-600">{profileError}</p>}
        {profileSaved && <p className="mb-3 text-sm text-emerald-700">Profile updated.</p>}
        <ProfileForm user={user} onSubmit={handleProfileSubmit} isSubmitting={isSavingProfile} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Change password</h2>
        {passwordError && <p className="mb-3 text-sm text-red-600">{passwordError}</p>}
        {passwordSaved && <p className="mb-3 text-sm text-emerald-700">Password changed.</p>}
        <ChangePasswordForm
          key={passwordFormKey}
          onSubmit={handlePasswordSubmit}
          isSubmitting={isSavingPassword}
        />
      </div>
    </div>
  );
};

export default Settings;
