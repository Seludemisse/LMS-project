"use client";
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Filter, Upload, FileText, FileImage, FileVideo, Download, Eye, Trash2, FolderOpen, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Resource {
  name: string;
  author: string;
  subject: string;
  fileType: string;
  uploadDate: string;
  size: string;
  downloads: number;
}

const resourcesData: Resource[] = [
  { name: 'Physics Formulas.docx', author: 'Robert Johnson', subject: 'Physics', fileType: 'docx', uploadDate: '2023-10-01', size: '2.3 MB', downloads: 45 },
  { name: 'Chemistry Lab Report.docx', author: 'David Martinez', subject: 'Chemistry', fileType: 'docx', uploadDate: '2023-09-25', size: '1.8 MB', downloads: 32 },
  { name: 'Programming Guide.pdf', author: 'Jane Smith', subject: 'Computer Science', fileType: 'pdf', uploadDate: '2023-09-20', size: '5.2 MB', downloads: 78 },
  { name: 'Biology Notes.pdf', author: 'Emily Davis', subject: 'Biology', fileType: 'pdf', uploadDate: '2023-09-15', size: '3.1 MB', downloads: 56 },
  { name: 'Calculus Notes.pdf', author: 'John Doe', subject: 'Mathematics', fileType: 'pdf', uploadDate: '2023-09-10', size: '4.7 MB', downloads: 89 },
  { name: 'History Timeline.pptx', author: 'Sarah Wilson', subject: 'History', fileType: 'pptx', uploadDate: '2023-09-05', size: '8.9 MB', downloads: 23 },
  { name: 'Literature Review.pdf', author: 'Michael Brown', subject: 'English Literature', fileType: 'pdf', uploadDate: '2023-09-01', size: '2.1 MB', downloads: 41 },
];

const ResourcesPage: React.FC = () => {
  const router = useRouter();
  const [resources] = useState(resourcesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('Upload Date');

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  }).sort((a, b) => {
    if (sortBy === 'Upload Date') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortBy === 'Downloads') {
      return b.downloads - a.downloads;
    } else if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'docx':
      case 'doc': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'pptx':
      case 'ppt': return <FileText className="w-6 h-6 text-orange-500" />;
      case 'jpg':
      case 'png':
      case 'gif': return <FileImage className="w-6 h-6 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov': return <FileVideo className="w-6 h-6 text-purple-500" />;
      default: return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-700 border-red-200';
      case 'docx':
      case 'doc': return 'bg-blue-100 text-blue-700 border-red-200';
      case 'pptx':
      case 'ppt': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'jpg':
      case 'png':
      case 'gif': return 'bg-green-100 text-green-700 border-green-200';
      case 'mp4':
      case 'avi':
      case 'mov': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalResources = resources.length;
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
  const contributorCount = new Set(resources.map(r => r.author)).size;
  const fileTypeCount = new Set(resources.map(r => r.fileType)).size;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Resources</h1>
                <p className="page-subtitle mt-1">Access and share study materials and resources.</p>
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
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={() => router.push('/resources/upload')}
                >
                  <Upload className="w-4 h-4" />
                  Upload Resource
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Search + Filters */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Subjects</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Computer Science</option>
                  <option>Biology</option>
                  <option>Mathematics</option>
                  <option>History</option>
                  <option>English Literature</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>Upload Date</option>
                  <option>Downloads</option>
                  <option>Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="space-y-4 animate-fade-in-up">
            {filteredResources.map((resource, index) => (
              <div
                key={index}
                className="card p-6 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {getFileIcon(resource.fileType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getFileTypeColor(resource.fileType)}`}>
                          {resource.fileType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>by {resource.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          <span>{resource.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{resource.uploadDate}</span>
                        </div>
                        <span>{resource.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Downloads</p>
                      <p className="font-semibold text-gray-900">{resource.downloads}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors duration-200" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors duration-200" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-200" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All Subjects');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Resources</h3>
              <p className="text-3xl font-bold text-blue-600">{totalResources}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Downloads</h3>
              <p className="text-3xl font-bold text-green-600">{totalDownloads}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contributors</h3>
              <p className="text-3xl font-bold text-purple-600">{contributorCount}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">File Types</h3>
              <p className="text-3xl font-bold text-orange-600">{fileTypeCount}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResourcesPage;