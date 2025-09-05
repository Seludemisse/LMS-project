'use client'

import Sidebar from '../components/Sidebar'
import { useState } from 'react'
import { Bell, CheckCircle, XCircle, AlertCircle, Info, Clock, Search, Filter, Trash2, Archive } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Notification = {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  category: string
}

export default function NotificationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [showRead, setShowRead] = useState(true)

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Assignment Due Soon',
      message: 'Your Calculus II assignment is due in 2 days. Don\'t forget to submit!',
      type: 'warning',
      timestamp: '2 hours ago',
      read: false,
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Grade Posted',
      message: 'Your Physics quiz grade has been posted. Check your results!',
      type: 'success',
      timestamp: '1 day ago',
      read: false,
      category: 'Academic'
    },
    {
      id: 3,
      title: 'Class Cancelled',
      message: 'Today\'s Computer Science lecture has been cancelled due to instructor illness.',
      type: 'info',
      timestamp: '3 hours ago',
      read: true,
      category: 'Schedule'
    },
    {
      id: 4,
      title: 'Payment Reminder',
      message: 'Your tuition payment is due next week. Please complete payment to avoid late fees.',
      type: 'error',
      timestamp: '2 days ago',
      read: false,
      category: 'Financial'
    },
    {
      id: 5,
      title: 'Library Book Due',
      message: 'The book "Data Structures and Algorithms" is due for return in 3 days.',
      type: 'warning',
      timestamp: '4 hours ago',
      read: true,
      category: 'Library'
    },
    {
      id: 6,
      title: 'New Course Available',
      message: 'Advanced Machine Learning course is now available for registration.',
      type: 'info',
      timestamp: '1 week ago',
      read: true,
      category: 'Academic'
    }
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />
      case 'warning': return <AlertCircle className="w-5 h-5" />
      case 'error': return <XCircle className="w-5 h-5" />
      case 'info': return <Info className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(search.toLowerCase()) ||
                         notification.message.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'All Types' || notification.type === typeFilter
    const matchesCategory = categoryFilter === 'All Categories' || notification.category === categoryFilter
    const matchesRead = showRead || !notification.read
    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const totalCount = notifications.length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <header className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in-up">
                <h1 className="page-title">Notifications</h1>
                <p className="page-subtitle mt-1">Stay updated with important announcements and alerts.</p>
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
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total</h3>
              <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unread</h3>
              <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
            </div>
            
            <div className="card p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Read</h3>
              <p className="text-3xl font-bold text-green-600">{totalCount - unreadCount}</p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="card p-6 animate-slide-in-left">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Types</option>
                  <option>info</option>
                  <option>success</option>
                  <option>warning</option>
                  <option>error</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field lg:w-auto"
                >
                  <option>All Categories</option>
                  <option>Academic</option>
                  <option>Schedule</option>
                  <option>Financial</option>
                  <option>Library</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showRead}
                    onChange={(e) => setShowRead(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show read</span>
                </label>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4 animate-fade-in-up">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`card p-6 hover-lift ${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{notification.timestamp}</span>
                      </div>
                      {!notification.read && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('All Types');
                  setCategoryFilter('All Categories');
                  setShowRead(true);
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mark All Read</h3>
              <p className="text-gray-600">Clear all notifications</p>
            </div>
            
            {/* <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Archive</h3>
              <p className="text-gray-600">Save important notifications</p>
            </div> */}
            
            {/* <div className="card p-6 text-center hover-lift cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Configure preferences</p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}