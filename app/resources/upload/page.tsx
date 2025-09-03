"use client";

import Sidebar from '../../components/Sidebar'
import { useState } from 'react'
import { Upload, FileText, FileImage, FileVideo, Archive, X, ArrowLeft, Plus, Tag, Calendar, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UploadForm {
  title: string
  description: string
  category: string
  tags: string[]
  visibility: 'public' | 'private' | 'course'
  courseCode: string
}

export default function ResourcesUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<UploadForm>({
    title: '',
    description: '',
    category: '',
    tags: [],
    visibility: 'public',
    courseCode: ''
  })

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return <FileImage className="w-8 h-8 text-green-600" />
    if (type.startsWith('video/')) return <FileVideo className="w-8 h-8 text-purple-600" />
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-8 h-8 text-blue-600" />
    return <Archive className="w-8 h-8 text-orange-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload')
      return
    }
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          alert('Files uploaded successfully!')
          router.push('/resources')
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const goBack = () => {
    router.push('/resources')
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
                    <button
                      onClick={() => router.push('/resources/upload')}
                      className="text-left"
                    >
                      <h1 className="page-title">Upload Resources</h1>
                      <p className="page-subtitle mt-1">Share your course materials and study resources.</p>
                    </button>
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
          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Selection */}
            <div className="card p-8 animate-fade-in-up">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-600" />
                Select Files
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to browse</h3>
                <p className="text-gray-600 mb-4">Support for PDF, images, videos, and documents up to 100MB</p>
                <label className="btn-primary cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  Choose Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resource Details */}
            <div className="card p-8 animate-slide-in-left">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resource Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter resource title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Study Guides">Study Guides</option>
                    <option value="Presentations">Presentations</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="Tutorials">Tutorials</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., CS301, MATH201"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="course">Course Only</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Describe the resource content and how it can be used..."
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Press Enter to add tags"
                    onKeyDown={addTag}
                    className="input-field"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="card p-8 animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Uploading Files...</h2>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-gray-600">{uploadProgress}% Complete</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 animate-fade-in-up">
              <button
                type="button"
                onClick={goBack}
                className="btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={isUploading || selectedFiles.length === 0}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Resources'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
