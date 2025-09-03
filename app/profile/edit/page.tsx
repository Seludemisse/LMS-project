"use client";

import Sidebar from '../../components/Sidebar'
import { useState } from 'react'
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Save, X, Camera, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  major: string
  year: string
  studentId: string
  bio: string
  address: string
  dateOfBirth: string
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    major: 'Computer Science',
    year: 'Junior',
    studentId: '123456789',
    bio: 'Computer Science student with interests in artificial intelligence and web development. Passionate about creating innovative solutions and learning new technologies.',
    address: '123 University Ave, College Town, ST 12345',
    dateOfBirth: '2000-05-15'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    // In a real app, you would save to the backend here
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      major: 'Computer Science',
      year: 'Junior',
      studentId: '123456789',
      bio: 'Computer Science student with interests in artificial intelligence and web development. Passionate about creating innovative solutions and learning new technologies.',
      address: '123 University Ave, College Town, ST 12345',
      dateOfBirth: '2000-05-15'
    })
    setIsEditing(false)
  }

  const goBack = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-4">
                  <button
                    onClick={goBack}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="page-title">Edit Profile</h1>
                    <p className="page-subtitle mt-1">Update your personal information and preferences.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleProfileClick}
                  className="w-12 h-12 rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                >
                  <img
                    src="/profile.jfif"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Profile Picture Section */}
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
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600">{profileData.major} • {profileData.year}</p>
          </div>

          {/* Personal Information */}
          <div className="card p-8 animate-slide-in-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card p-8 animate-slide-in-left">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              Academic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
                <select
                  name="major"
                  value={profileData.major}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                >
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>History</option>
                  <option>English Literature</option>
                  <option>Economics</option>
                  <option>Psychology</option>
                  <option>Engineering</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  name="year"
                  value={profileData.year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                >
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                  <option>Graduate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={profileData.studentId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="card p-8 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">About Me</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 animate-fade-in-up">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-success flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Profile</h3>
              <p className="text-gray-600">See your current profile</p>
            </div>
            
            <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Photo</h3>
              <p className="text-gray-600">Update profile picture</p>
            </div>
            
            <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Info</h3>
              <p className="text-gray-600">Update course details</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
