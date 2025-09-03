"use client";
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Phone, BookOpen, Award, Calendar, Edit3, Save, X, Camera, MapPin, GraduationCap } from 'lucide-react';

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

const initialProfile: Profile = {
  name: 'John Doe',
  major: 'Computer Science',
  year: 'Junior',
  studentId: '123456789',
  email: 'student@example.com',
  phone: '(555) 123-4567',
  bio: 'Computer Science student with interests in artificial intelligence and web development.',
  courses: [
    { code: 'CS301', name: 'Data Structures and Algorithms', details: '/courses/cs301' },
    { code: 'MATH201', name: 'Calculus II', details: '/courses/math201' },
    { code: 'PHYS101', name: 'Introduction to Physics', details: '/courses/phys101' },
    { code: 'ENG205', name: 'Technical Writing', details: '/courses/eng205' },
    { code: 'HIST50', name: 'World History', details: '/courses/hist50' },
  ],
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Profile</h1>
                <p className="page-subtitle mt-1">Manage your personal information and preferences.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={isEditing ? handleSave : handleEdit}
                  className={`flex items-center gap-2 ${
                    isEditing ? 'btn-success' : 'btn-primary'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
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
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{profile.name}</h2>
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

          {/* Personal Information */}
          <div className="card p-8 animate-slide-in-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={editedProfile.phone}
                        onChange={handleChange}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="card p-8 animate-slide-in-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Major</p>
                  <p className="font-medium text-gray-900">{profile.major}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-medium text-gray-900">{profile.year}</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedProfile.bio}
                  onChange={handleChange}
                  className="input-field"
                  rows={3}
                />
              ) : (
                <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="card p-8 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-600" />
              Enrolled Courses
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.courses.map((course, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover-lift cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {course.code}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Courses</h3>
              <p className="text-3xl font-bold text-blue-600">{profile.courses.length}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPA</h3>
              <p className="text-3xl font-bold text-green-600">3.8</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Credits</h3>
              <p className="text-3xl font-bold text-purple-600">72</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <p className="text-3xl font-bold text-orange-600">Active</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;