"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  GraduationCap,
} from "lucide-react";

interface Course {
  code: string;
  name: string;
  details: string;
}

interface Profile {
  name: string;
  major: string;
  year: string;
  studentId: string;
  email: string;
  phone: string;
  bio: string;
  courses: Course[];
}

const emptyProfile: Profile = {
  name: "",
  major: "",
  year: "",
  studentId: "",
  email: "",
  phone: "",
  bio: "",
  courses: [],
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [editedProfile, setEditedProfile] = useState<Profile>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync editedProfile whenever profile changes (after fetch)
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: Profile = await res.json(); // ensure backend matches Profile
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    setIsSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data: { user: Profile } = await res.json();
      setProfile(data.user);
      setEditedProfile(data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="page-title">Profile</h1>
              <p className="page-subtitle mt-1">
                Manage your personal information and preferences.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className={`flex items-center gap-2 ${
                  isEditing ? "btn-success" : "btn-primary"
                }`}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Profile Header */}
          <div className="card p-8 text-center animate-fade-in-up">
            <div className="relative inline-block mb-6">
              <img
                src="/profile.jfif"
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-200"
              />
              {isEditing && (
                <label className="absolute bottom-4 right-4 bg-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedProfile.name}
                onChange={handleChange}
                className="text-2xl font-bold mb-3 w-full text-center input-field max-w-xs mx-auto"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {profile.name}
              </h2>
            )}

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="w-4 h-4" />
                <span>{profile.major}</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{profile.year}</span>
              </div>
            </div>

            <p className="text-gray-600">Student ID: {profile.studentId}</p>
          </div>

          {/* Personal Info */}
          <div className="card p-8 animate-slide-in-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["email", "phone", "bio"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {isEditing ? (
                    field === "bio" ? (
                      <textarea
                        name={field}
                        value={(editedProfile[field as keyof Profile] as string)?? ""}
                        onChange={handleChange}
                        className="input-field"
                        rows={4}
                      />
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={typeof editedProfile[field as keyof Profile] === "string" ? editedProfile[field as keyof Profile] as string : ""}
                        onChange={handleChange}
                        className="input-field"
                      />
                    )
                  ) : (
                    <p className="p-4 bg-gray-50 rounded-lg">
                      {profile[field as keyof Profile] as string}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
