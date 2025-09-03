'use client'

import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { Search, Filter, Plus, Calendar, BookOpen, CheckCircle, Clock, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Assignment = {
  id: number
  title: string
  subject: string
  description: string
  dueDate: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'Completed' | 'Overdue'
  completed: boolean
}

export default function AssignmentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')
  const [dueFilter, setDueFilter] = useState('Due Date')
  const [showAddPopup, setShowAddPopup] = useState(false)

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Calculus Problem Set 5',
      subject: 'Mathematics',
      description: 'Complete problems 1-20 from Chapter 3',
      dueDate: '2023-10-15',
      priority: 'High',
      status: 'Pending',
      completed: false,
    },
    {
      id: 2,
      title: 'Programming Project',
      subject: 'Computer Science',
      description: 'Build a web application using React',
      dueDate: '2023-10-20',
      priority: 'High',
      status: 'Pending',
      completed: false,
    },
    {
      id: 3,
      title: 'Physics Lab Report',
      subject: 'Physics',
      description: 'Write report on pendulum experiment',
      dueDate: '2023-10-12',
      priority: 'Medium',
      status: 'Completed',
      completed: true,
    },
    {
      id: 4,
      title: 'History Essay',
      subject: 'History',
      description: 'Write 1000-word essay on Industrial Revolution',
      dueDate: '2023-10-18',
      priority: 'Medium',
      status: 'Pending',
      completed: false,
    },
    {
      id: 5,
      title: 'Chemistry Quiz',
      subject: 'Chemistry',
      description: 'Study chapters 5-7 for quiz',
      dueDate: '2023-10-10',
      priority: 'Low',
      status: 'Completed',
      completed: true,
    },
  ])

  const toggleComplete = (id: number) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === id
        ? { ...assignment, completed: !assignment.completed, status: assignment.completed ? 'Pending' : 'Completed' }
        : assignment
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200'
      case 'Pending': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const daysLeft = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || assignment.status === statusFilter
    const matchesSubject = subjectFilter === 'All Subjects' || assignment.subject === subjectFilter
    let matchesDue = true
    if (dueFilter === 'Due Today') matchesDue = daysLeft(assignment.dueDate) === 0
    else if (dueFilter === 'Due This Week') matchesDue = daysLeft(assignment.dueDate) <= 7
    else if (dueFilter === 'Due Next Week') matchesDue = daysLeft(assignment.dueDate) > 7 && daysLeft(assignment.dueDate) <= 14
    else if (dueFilter === 'Due Soon') matchesDue = daysLeft(assignment.dueDate) <= 2
    return matchesSearch && matchesStatus && matchesSubject && matchesDue
  })

  // Add Assignment Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newDueDate, setNewDueDate] = useState('')

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    const newAssignment: Assignment = {
      id: assignments.length + 1,
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      dueDate: newDueDate,
      priority: 'Medium',
      status: 'Pending',
      completed: false,
    }
    setAssignments([...assignments, newAssignment])
    setShowAddPopup(false)
    setNewTitle('')
    setNewDescription('')
    setNewSubject('')
    setNewDueDate('')
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
                <h1 className="page-title">Assignments</h1>
                <p className="page-subtitle mt-1">Track and manage your academic assignments.</p>
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
          {/* Search + Filters */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search assignments..."
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
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>Computer Science</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>History</option>
                </select>
                <select
                  value={dueFilter}
                  onChange={(e) => setDueFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>Due Date</option>
                  <option>Due Today</option>
                  <option>Due This Week</option>
                  <option>Due Next Week</option>
                  <option>Due Soon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-4 animate-fade-in-up">
            {filteredAssignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="card p-6 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{daysLeft(assignment.dueDate)} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <button
                      onClick={() => toggleComplete(assignment.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        assignment.completed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={assignment.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200" title="Edit assignment">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAssignments.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All Status');
                  setSubjectFilter('All Subjects');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => setShowAddPopup(true)}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Assignment</h3>
              <p className="text-gray-600">Create a new assignment</p>
            </div>
            
            <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mark Complete</h3>
              <p className="text-gray-600">Update assignment status</p>
            </div>
            
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => setDueFilter('Due Soon')}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Due Soon</h3>
              <p className="text-gray-600">View upcoming deadlines</p>
            </div>
          </div>
        </main>
      </div>

      {/* Add Assignment Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowAddPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add Assignment</h2>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <input
                type="text"
                placeholder="Assignment Name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Chapters to Study / Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="input-field"
                required
              />
              <button type="submit" className="btn-primary w-full">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
