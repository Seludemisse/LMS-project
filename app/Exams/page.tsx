'use client'
import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, CheckCircle, XCircle, Search, Filter, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
type Exam = {
  id: number
  subject: string
  title: string
  date: string
  time: string
  location: string
  duration: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  priority: 'High' | 'Medium' | 'Low'
}
export default function ExamsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')
  const handleProfileClick = () => {
    router.push('/profile');
  };
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Calculus II - Midterm',
      date: '2023-10-25',
      time: '9:00 AM',
      location: 'Hall A',
      duration: '2 hours',
      status: 'Upcoming',
      priority: 'High',
    },
    {
      id: 2,
      subject: 'Computer Science',
      title: 'Data Structures - Final',
      date: '2023-11-05',
      time: '2:00 PM',
      location: 'Lab 201',
      duration: '3 hours',
      status: 'Upcoming',
      priority: 'High',
    },
    {
      id: 3,
      subject: 'Physics',
      title: 'Mechanics - Quiz',
      date: '2023-10-18',
      time: '10:00 AM',
      location: 'Room 105',
      duration: '1 hour',
      status: 'Completed',
      priority: 'Medium',
    },
    {
      id: 4,
      subject: 'Chemistry',
      title: 'Organic Chemistry - Midterm',
      date: '2023-10-30',
      time: '1:00 PM',
      location: 'Lab 301',
      duration: '2.5 hours',
      status: 'Upcoming',
      priority: 'Medium',
    },
    {
      id: 5,
      subject: 'History',
      title: 'World History - Final',
      date: '2023-11-10',
      time: '9:00 AM',
      location: 'Hall B',
      duration: '3 hours',
      status: 'Upcoming',
      priority: 'Low',
    },
  ])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newExam, setNewExam] = useState({ title: '', subject: '', date: '', time: '', location: '', duration: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value })
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = exams.length ? Math.max(...exams.map(e => e.id)) + 1 : 1
    setExams([...exams, { ...newExam, id, status: 'Upcoming', priority: 'Medium' }])
    setNewExam({ title: '', subject: '', date: '', time: '', location: '', duration: '' })
    setIsAddModalOpen(false)
  }

  const handleMarkAsCompleted = (id: number) => {
    const updated = exams.map(e => e.id === id ? { ...e, status: 'Completed' as 'Completed' } : e)
    setExams(updated)
  }

  const handleGlobalMarkAsDone = () => {
    const upcomingExams = exams.filter(exam => exam.status === 'Upcoming')
    if (upcomingExams.length === 0) return
    const sortedUpcoming = [...upcomingExams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const next = sortedUpcoming[0]
    const updated = exams.map(e => e.id === next.id ? { ...e, status: 'Completed' as 'Completed' } : e)
    setExams(updated)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200'
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />
      case 'Cancelled': return <XCircle className="w-4 h-4" />
      case 'Upcoming': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || exam.status === statusFilter
    const matchesSubject = subjectFilter === 'All Subjects' || exam.subject === subjectFilter
    return matchesSearch && matchesStatus && matchesSubject
  })
  const upcomingExams = exams.filter(exam => exam.status === 'Upcoming')
  const completedExams = exams.filter(exam => exam.status === 'Completed')

  const subjects = ['All Subjects', ...new Set(exams.map(e => e.subject))]

  let nextExamText = 'N/A'
  if (upcomingExams.length > 0) {
    const sorted = [...upcomingExams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const nextDate = new Date(sorted[0].date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    nextDate.setHours(0, 0, 0, 0)
    const daysDiff = Math.ceil((nextDate.getTime() - today.getTime()) / 86400000)
    if (daysDiff < 0) {
      nextExamText = 'Passed'
    } else if (daysDiff === 0) {
      nextExamText = 'Today'
    } else if (daysDiff === 1) {
      nextExamText = 'Tomorrow'
    } else {
      nextExamText = `${daysDiff} days`
    }
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
                <h1 className="page-title">Exams</h1>
                <p className="page-subtitle mt-1">Track your upcoming exams and view past results.</p>
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
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming</h3>
              <p className="text-3xl font-bold text-blue-600">{upcomingExams.length}</p>
            </div>
           
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{completedExams.length}</p>
            </div>
           
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Exam</h3>
              <p className="text-3xl font-bold text-purple-600">{nextExamText}</p>
            </div>
          </div>
          {/* Search + Filters */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Status</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  {subjects.map(sub => <option key={sub}>{sub}</option>)}
                </select>
              </div>
            </div>
          </div>
          {/* Upcoming Exams */}
          <div className="card p-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Upcoming Exams
            </h2>
           
            <div className="space-y-4">
              {filteredExams.filter(exam => exam.status === 'Upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((exam, index) => (
                <div
                  key={exam.id}
                  className="p-6 border border-gray-200 rounded-lg hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(exam.priority)}`}>
                          {exam.priority} Priority
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{exam.subject}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{exam.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200" title="View details">
                        <BookOpen className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleMarkAsCompleted(exam.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200" 
                        title="Mark as completed"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Completed Exams */}
          <div className="card p-8 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Completed Exams
            </h2>
           
            <div className="space-y-4">
              {filteredExams.filter(exam => exam.status === 'Completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exam, index) => (
                <div
                  key={exam.id}
                  className="p-6 border border-gray-200 rounded-lg hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{exam.subject}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{exam.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200" title="View results">
                        <BookOpen className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Exam</h3>
              <p className="text-gray-600">Schedule a new exam</p>
            </div>
           
            <div className="card p-6 text-center hover-lift cursor-pointer" onClick={handleGlobalMarkAsDone}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mark as Done</h3>
              <p className="text-gray-600">Mark next exam as completed</p>
            </div>
           
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => router.push('/resources')}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Materials</h3>
              <p className="text-gray-600">Access resources</p>
            </div>
          </div>
        </main>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Exam</h2>
            <form onSubmit={handleAddSubmit}>
              <input
                name="title"
                value={newExam.title}
                onChange={handleInputChange}
                placeholder="Exam Name"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="subject"
                value={newExam.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="date"
                type="date"
                value={newExam.date}
                onChange={handleInputChange}
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="time"
                value={newExam.time}
                onChange={handleInputChange}
                placeholder="Time (e.g., 9:00 AM)"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="location"
                value={newExam.location}
                onChange={handleInputChange}
                placeholder="Venue"
                className="input-field mb-4 w-full"
                required
              />
              <input
                name="duration"
                value={newExam.duration}
                onChange={handleInputChange}
                placeholder="Total Time (e.g., 2 hours)"
                className="input-field mb-4 w-full"
                required
              />
              <button type="submit" className="btn-primary w-full mb-4">Submit</button>
            </form>
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}