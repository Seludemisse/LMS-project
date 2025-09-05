"use client";

import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { Search, Plus, Calendar, BookOpen, CheckCircle, Clock, X, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Assignment = {
  id: number
  title: string
  subject: string
  description: string
  dueDate: string
  priority?: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'Completed' | 'Overdue'
  completed: boolean
}

type User = {
  id: number
  role: 'ADMIN' | 'user'
}

export default function AssignmentsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [subjectFilter, setSubjectFilter] = useState<string>('All Subjects')
  const [dueFilter, setDueFilter] = useState<string>('Due Date')
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [currentEdit, setCurrentEdit] = useState<Assignment | null>(null)

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')

  const [subjects, setSubjects] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])

  // Submission content state for each assignment
  const [submissionContent, setSubmissionContent] = useState<{ [key: number]: string }>({})

  // Compute days left
  const daysLeft = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Compute live status including overdue
  const computeStatus = (assignment: Assignment) => {
    if (assignment.completed) return 'Completed'
    const days = daysLeft(assignment.dueDate)
    return days < 0 ? 'Overdue' : assignment.status
  }

//   useEffect(() => {
//   console.log("Logged-in user:", user);
// }, [user]);


  // Load meta data for dropdowns
  useEffect(() => {
    async function fetchMeta() {
      const token = localStorage.getItem('token')
      if (!token) return
      const res = await fetch('http://localhost:5000/api/assignments/meta', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSubjects(data.subjects)
        setStatuses(data.statuses)
      }
    }
    fetchMeta()
  }, [])

  // Load user & assignments
  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const userRes = await fetch("http://localhost:5000/api/me", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (userRes.ok) setUser(await userRes.json())

        const res = await fetch("http://localhost:5000/api/assignments", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAssignments(data.map((a: Assignment) => ({ ...a, status: computeStatus(a) })))
        }
      } catch (err) {
        console.error("Failed to load data:", err)
      }
    }
    loadData()
  }, [])

  // Pre-fill edit form
  useEffect(() => {
    if (currentEdit) {
      setNewTitle(currentEdit.title)
      setNewDescription(currentEdit.description)
      setNewSubject(currentEdit.subject)
      setNewDueDate(currentEdit.dueDate.split("T")[0])
      setNewPriority(currentEdit.priority || 'Medium')
      setShowAddPopup(true)
    }
  }, [currentEdit])

  const handleProfileClick = () => router.push('/profile')

  // Toggle complete
  const toggleComplete = async (id: number, completed: boolean) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ completed, status: completed ? "Completed" : "Pending" })
      })
      if (!res.ok) throw new Error("Failed to update")
      const updated = await res.json()
      updated.status = computeStatus(updated)
      setAssignments(assignments.map(a => a.id === id ? updated : a))
    } catch (err) {
      console.error(err)
      alert("Failed to update assignment")
    }
  }

  // Delete
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")
    if (!confirm("Are you sure you want to delete this assignment?")) return
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to delete")
      setAssignments(assignments.filter(a => a.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete assignment")
    }
  }

  // Add/Edit assignment
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    try {
      let res
      if (currentEdit) {
        res = await fetch(`http://localhost:5000/api/assignments/${currentEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({
            title: newTitle,
            subject: newSubject,
            description: newDescription,
            dueDate: newDueDate,
            priority: newPriority,
            status: currentEdit.status,
            completed: currentEdit.completed
          })
        })
      } else {
        res = await fetch("http://localhost:5000/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({
            title: newTitle,
            subject: newSubject,
            description: newDescription,
            dueDate: newDueDate,
            priority: newPriority,
            status: "Pending",
            completed: false
          })
        })
      }
      if (!res.ok) throw new Error("Failed to submit")
      const data = await res.json()
      data.status = computeStatus(data)
      if (currentEdit) setAssignments(assignments.map(a => a.id === data.id ? data : a))
      else setAssignments([...assignments, data])
      setShowAddPopup(false)
      setCurrentEdit(null)
      setNewTitle(""); setNewDescription(""); setNewSubject(""); setNewDueDate(""); setNewPriority('Medium')
    } catch (err) {
      console.error(err)
      alert("Failed to submit assignment")
    }
  }

  // Submission handler
  const handleSubmit = async (assignmentId: number) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:5000/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content: submissionContent[assignmentId] })
      })
      if (!res.ok) throw new Error("Failed to submit assignment")
      const submission = await res.json()

    // Update assignment status to completed
    setAssignments(assignments.map(a => a.id === assignmentId ? { ...a, completed: true, status: 'Completed' } : a))
    setSubmissionContent({ ...submissionContent, [assignmentId]: "" })
     
    } catch (err) {
      console.error(err)
      alert("Failed to submit assignment")
    }
  }

  // Filtered assignments
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || computeStatus(a) === statusFilter
    const matchesSubject = subjectFilter === 'All Subjects' || a.subject === subjectFilter
    let matchesDue = true
    if (dueFilter === 'Due Today') matchesDue = daysLeft(a.dueDate) === 0
    else if (dueFilter === 'Due This Week') matchesDue = daysLeft(a.dueDate) <= 7
    else if (dueFilter === 'Due Next Week') matchesDue = daysLeft(a.dueDate) > 7 && daysLeft(a.dueDate) <= 14
    else if (dueFilter === 'Due Soon') matchesDue = daysLeft(a.dueDate) <= 2
    return matchesSearch && matchesStatus && matchesSubject && matchesDue
  })

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="page-title">Assignments</h1>
              <p className="page-subtitle mt-1">Track and manage your academic assignments.</p>
            </div>
            <button onClick={handleProfileClick} className="w-12 h-12 rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform duration-200">
              <img src="/profile.jfif" alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center bg-white rounded-lg shadow-sm px-4 py-2 w-64">
              <Search className="w-5 h-5 text-gray-400"/>
              <input
                type="text"
                placeholder="Search assignments..."
                className="ml-2 flex-1 border-none focus:ring-0"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All Status">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
              <option value="All Subjects">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {user?.role === 'ADMIN' && (
              <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddPopup(true)}>
                <Plus className="w-5 h-5"/> Add Assignment
              </button>
            )}
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map(a => (
              <div key={a.id} className="card p-6 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{a.title}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(a.priority||'Medium')}`}>{a.priority||'Medium'}</span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(a.status)}`}>{a.status}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{a.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><BookOpen className="w-4 h-4"/><span>{a.subject}</span></div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>Due: {a.dueDate}</span></div>
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4"/><span>{daysLeft(a.dueDate)} days left</span></div>
                    </div>

                    {/* ✅ Submission Box */}
                    { user && user.role === 'user' && !a.completed &&(
                      <div className="mt-4">
                        <textarea
                          placeholder="Write your submission here..."
                          value={submissionContent[a.id] || ''}
                          onChange={e => setSubmissionContent({...submissionContent, [a.id]: e.target.value})}
                          className="input-field w-full mb-2"
                        />
                        <button
                          onClick={() => handleSubmit(a.id)}
                          className="btn-primary w-full"
                          disabled={!submissionContent[a.id]?.trim()}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-6">
                    <button
                      onClick={() => toggleComplete(a.id, !a.completed)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${a.completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      title={a.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle className="w-5 h-5"/>
                    </button>
                    {user?.role === 'ADMIN' && (
                      <>
                        <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Edit assignment" onClick={() => setCurrentEdit(a)}>
                          <Plus className="w-5 h-5"/>
                        </button>
                        <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200" title="Delete assignment" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Popup */}
          {showAddPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => { setShowAddPopup(false); setCurrentEdit(null); }}>
                  <X className="w-5 h-5"/>
                </button>
                <h2 className="text-xl font-semibold mb-4">{currentEdit ? 'Edit Assignment' : 'Add New Assignment'}</h2>
                <form onSubmit={handleSubmitAssignment} className="space-y-4">
                  <input type="text" placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="input-field w-full" required />
                  <textarea placeholder="Description" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="input-field w-full" required />
                  <input type="text" placeholder="Subject" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="input-field w-full" required />
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="input-field w-full" required />
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="input-field w-full" required>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button type="submit" className="btn-primary w-full">{currentEdit ? 'Update Assignment' : 'Create Assignment'}</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
