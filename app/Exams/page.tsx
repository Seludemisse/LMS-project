'use client'
import Sidebar from '../components/Sidebar'
import { useEffect, useState } from 'react'
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

type Result = {
  id: number
  score: number
  details?: string
  exam: Exam
}

export default function ExamsPage() {
  const router = useRouter()

  // -------------------------
  // State hooks
  // -------------------------
  const [token, setToken] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const [exams, setExams] = useState<Exam[]>([])
  const [results, setResults] = useState<Result[]>([])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newExam, setNewExam] = useState({ title: '', subject: '', date: '', time: '', location: '', duration: '' })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editExam, setEditExam] = useState<Exam | null>(null)

  const [takeExamId, setTakeExamId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', ''])
  const [score, setScore] = useState<number>(0)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All Status' | 'Upcoming' | 'Completed' | 'Cancelled'>('All Status')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')

  const isAdmin = userRole === 'admin'

  // -------------------------
  // Auto-login (toggle admin/user here)
  // -------------------------
  
useEffect(() => {
  const login = async () => {
    try {
       const email = prompt('Enter email (admin@lms.com or user@lms.com)')
        const password = prompt('Enter password')
        if (!email || !password) return

      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error('Login request failed')
      const data = await res.json(); // parse response JSON first
      if (!data.token) throw new Error('Login failed')
      
        setToken(data.token)
      const me = await fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const meData = await me.json();
      setUserRole(meData.role);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  login();
}, []);

  // -------------------------
  // Fetch exams
  // -------------------------
  useEffect(() => {
    if (!token) return
    const fetchExams = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/exams', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Exams fetch failed')
        setExams(data)
      } catch (err) {
        console.error('Fetch exams error:', err)
      }
    }
    fetchExams()
  }, [token])

  // -------------------------
  // Add a dummy exam for users
  // -------------------------
  useEffect(() => {
    if (!isAdmin && exams.length === 0) {
      setExams([{
        id: 999,
        title: 'Test Exam',
        subject: 'Math',
        date: '2025-09-05',
        time: '10:00',
        location: 'Room 101',
        duration: '60 min',
        status: 'Upcoming',
        priority: 'Medium'
      }])
    }
  }, [isAdmin, exams])

  // -------------------------
  // Fetch student results
  // -------------------------
  useEffect(() => {
    if (!token || userRole !== 'user') return
    const fetchResults = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/exams/my-results', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Results fetch failed')
        setResults(data)
      } catch (err) {
        console.error('Fetch results error:', err)
      }
    }
    fetchResults()
  }, [token, userRole])

  if (!token || !userRole ) return <div>Loading...</div>

  // -------------------------
  // Handlers
  // -------------------------
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newExam, status: 'Upcoming', priority: 'Medium' })
      })
      const data = await res.json()
      setExams([data, ...exams])
      setIsAddModalOpen(false)
      setNewExam({ title: '', subject: '', date: '', time: '', location: '', duration: '' })
    } catch (err) {
      console.error('Add exam error:', err)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !editExam) return
    try {
      const res = await fetch(`http://localhost:5000/api/exams/${editExam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editExam)
      })
      const updated = await res.json()
      setExams(exams.map(e => e.id === updated.id ? updated : e))
      setIsEditModalOpen(false)
      setEditExam(null)
    } catch (err) {
      console.error('Edit exam error:', err)
    }
  }

  const handleDeleteExam = async (id: number) => {
    if (!token) return
    if (!window.confirm('Delete exam?')) return
    try {
      await fetch(`http://localhost:5000/api/exams/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setExams(exams.filter(e => e.id !== id))
    } catch (err) {
      console.error('Delete exam error:', err)
    }
  }

  const handleTakeSubmit = async () => {
    if (!token || !takeExamId) return
    const calculatedScore = answers.filter(ans => ans.trim() !== '').length
    try {
      await fetch(`http://localhost:5000/api/exams/${takeExamId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score: calculatedScore, details: JSON.stringify(answers) })
      })
      setTakeExamId(null)
      setAnswers(['', '', '', '', ''])
    } catch (err) {
      console.error('Submit exam error:', err)
    }
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(search.toLowerCase()) || exam.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All Status' || exam.status === statusFilter
    const matchesSubject = subjectFilter === 'All Subjects' || exam.subject === subjectFilter
    return matchesSearch && matchesStatus && matchesSubject
  })

  const subjects = ['All Subjects', ...Array.from(new Set(exams.map(e => e.subject)))]

  // -------------------------
  // Render JSX
  // -------------------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Filters + Add button */}
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <input type="text" placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} className="border px-2 py-1 rounded" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} className="border px-2 py-1 rounded">
            <option>All Status</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="border px-2 py-1 rounded">
            {subjects.map(subj => <option key={subj}>{subj}</option>)}
          </select>
          {token && isAdmin && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setIsAddModalOpen(true)}>Add Exam</button>
          )}
        </div>

        {/* Exam List */}
        <div>
          {filteredExams.map(exam => (
            <div key={exam.id} className="p-2 border rounded my-1 flex justify-between items-center">
              <div>
                <span className="font-semibold">{exam.title}</span> ({exam.subject}) - {exam.date} {exam.time} @ {exam.location} [{exam.status}]
              </div>
              <div className="flex gap-2">
                {token && isAdmin ? (
                  <>
                    <button onClick={() => { setEditExam(exam); setIsEditModalOpen(true) }}>Edit</button>
                    <button onClick={() => handleDeleteExam(exam.id)}>Delete</button>
                  </>
                ) : (
                  token && !isAdmin && exam.status === 'Upcoming' && (
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => setTakeExamId(exam.id)}>Take Exam</button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Take Exam Modal */}
        {takeExamId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <h2>Take Exam</h2>
              {answers.map((a, i) => (
                <input key={i} placeholder={`Question ${i + 1}`} value={answers[i]} onChange={e => setAnswers(prev => prev.map((v, idx) => idx === i ? e.target.value : v))} className="w-full border p-1 mb-2 rounded" />
              ))}
              <button onClick={handleTakeSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
              <button onClick={() => setTakeExamId(null)} className="ml-2 px-4 py-2">Cancel</button>
            </div>
          </div>
        )}

        {/* Student Results */}
        {!isAdmin && results.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold">My Results</h2>
            {results.map(r => (
              <div key={r.id} className="p-2 border rounded my-1">{r.exam.title} → Score: {r.score}</div>
            ))}
          </div>
        )}

        {/* Add/Edit Modals */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
              <h2>Add Exam</h2>
              <form onSubmit={handleAddSubmit} className="flex flex-col gap-2">
                <input name="title" placeholder="Title" value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} />
                <input name="subject" placeholder="Subject" value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} />
                <input type="date" name="date" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                <input name="time" placeholder="Time" value={newExam.time} onChange={e => setNewExam({ ...newExam, time: e.target.value })} />
                <input name="location" placeholder="Location" value={newExam.location} onChange={e => setNewExam({ ...newExam, location: e.target.value })} />
                <input name="duration" placeholder="Duration" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: e.target.value })} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
              </form>
              <button onClick={() => setIsAddModalOpen(false)} className="mt-2">Close</button>
            </div>
          </div>
        )}

        {isEditModalOpen && editExam && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded">
              <h2>Edit Exam</h2>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                <input name="title" value={editExam.title} onChange={e => setEditExam({ ...editExam, title: e.target.value })} />
                <input name="subject" value={editExam.subject} onChange={e => setEditExam({ ...editExam, subject: e.target.value })} />
                <input type="date" name="date" value={editExam.date} onChange={e => setEditExam({ ...editExam, date: e.target.value })} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              </form>
              <button onClick={() => setIsEditModalOpen(false)} className="mt-2">Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
