'use client'

import Sidebar from '../components/Sidebar'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, BookOpen, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ClassSchedulePage() {
  const router = useRouter();
  
  const handleProfileClick = () => {
    router.push('/profile');
  };

  const [todayClasses, setTodayClasses] = useState([
    {
      day: 'Monday',
      time: '8:00 AM - 9:00 AM',
      subject: 'Mathematics',
      room: '201',
      professor: 'Dr. Smith',
      color: 'bg-blue-200 border-blue-500',
    },
    {
      day: 'Monday',
      time: '10:00 AM - 11:00 AM',
      subject: 'Physics',
      room: 'Lab 301',
      professor: 'Prof. Johnson',
      color: 'bg-green-200 border-green-500',
    },
    {
      day: 'Tuesday',
      time: '9:00 AM - 10:00 AM',
      subject: 'Computer Science',
      room: 'Computer Lab',
      professor: 'Dr. Davis',
      color: 'bg-purple-200 border-purple-500',
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: '',
    time: '',
    room: '',
    professor: '',
  });

  const handleAddClass = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewClass({
      subject: '',
      time: '',
      room: '',
      professor: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.subject || !newClass.time || !newClass.room || !newClass.professor) return;

    const colors = [
      'bg-blue-200 border-blue-500',
      'bg-green-200 border-green-500',
      'bg-purple-200 border-purple-500',
      'bg-orange-200 border-orange-500',
      'bg-red-200 border-red-500',
      'bg-yellow-200 border-yellow-500',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const classToAdd = {
      day: 'Today',
      time: newClass.time,
      subject: newClass.subject,
      room: newClass.room,
      professor: newClass.professor,
      color: randomColor,
    };

    setTodayClasses([...todayClasses, classToAdd]);
    handleClosePopup();
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ]

  const schedule = [
    {
      day: 'Monday',
      time: '8:00 AM - 9:00 AM',
      subject: 'Mathematics',
      room: '201',
      professor: 'Dr. Smith',
      color: 'bg-blue-200 border-blue-500',
    },
    {
      day: 'Monday',
      time: '10:00 AM - 11:00 AM',
      subject: 'Physics',
      room: 'Lab 301',
      professor: 'Prof. Johnson',
      color: 'bg-green-200 border-green-500',
    },
    {
      day: 'Tuesday',
      time: '9:00 AM - 10:00 AM',
      subject: 'Computer Science',
      room: 'Computer Lab',
      professor: 'Dr. Davis',
      color: 'bg-purple-200 border-purple-500',
    },
    {
      day: 'Wednesday',
      time: '2:00 PM - 3:00 PM',
      subject: 'English Literature',
      room: '105',
      professor: 'Prof. Wilson',
      color: 'bg-orange-200 border-orange-500',
    },
    {
      day: 'Thursday',
      time: '11:00 AM - 12:00 PM',
      subject: 'Chemistry',
      room: 'Lab 201',
      professor: 'Dr. Brown',
      color: 'bg-red-200 border-red-500',
    },
    {
      day: 'Friday',
      time: '1:00 PM - 2:00 PM',
      subject: 'History',
      room: '203',
      professor: 'Prof. Martinez',
      color: 'bg-yellow-200 border-yellow-500',
    },
  ]

  const getScheduleForDayAndTime = (day: string, time: string) => {
    return schedule.find(s => s.day === day && s.time.includes(time))
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
                <h1 className="page-title">Class Schedule</h1>
                <p className="page-subtitle mt-1">View your weekly class schedule and manage your time.</p>
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
          {/* Week Navigation */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex items-center justify-between">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900">Week of October 9, 2023</h2>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="card p-8 animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">Time</th>
                    {days.map((day) => (
                      <th key={day} className="text-center p-4 font-semibold text-gray-900">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {times.map((time) => (
                    <tr key={time} className="border-t border-gray-200">
                      <td className="p-4 text-sm font-medium text-gray-600">
                        {time}
                      </td>
                      {days.map((day) => {
                        const classInfo = getScheduleForDayAndTime(day, time)
                        return (
                          <td key={`${day}-${time}`} className="p-2">
                            {classInfo ? (
                              <div className={`p-3 rounded-lg border-2 ${classInfo.color} hover-lift cursor-pointer`}>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                  {classInfo.subject}
                                </h3>
                                <div className="space-y-1 text-xs text-gray-700">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{classInfo.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>Room {classInfo.room}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{classInfo.professor}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 text-gray-400 text-center">
                                <span className="text-xs">Free</span>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="card p-8 animate-slide-in-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Today's Classes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayClasses.map((classInfo, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 ${classInfo.color} hover-lift`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{classInfo.subject}</h3>
                    <BookOpen className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{classInfo.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Room {classInfo.room}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{classInfo.professor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div
              onClick={handleAddClass}
              className="card p-6 text-center hover-lift cursor-pointer"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Class</h3>
              <p className="text-gray-600">Schedule a new class</p>
            </div>
            
            {/* <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Materials</h3>
              <p className="text-gray-600">Access your class materials</p>
            </div> */}
            
            <div
              className="card p-6 text-center hover-lift cursor-pointer"
              onClick={() => { window.location.href = '/resources'; }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Materials</h3>
              <p className="text-gray-600">Access your class materials</p>
            </div>
          </div>
        </main>
      </div>

      {/* Add Class Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject Name"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                className="w-full border rounded-lg p-3 text-black placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Time (e.g. 2:00 PM - 3:00 PM)"
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                className="w-full border rounded-lg p-3 text-black placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Room"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="w-full border rounded-lg p-3 text-black placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Teacher Name"
                value={newClass.professor}
                onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                className="w-full border rounded-lg p-3 text-black placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full btn-primary text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
