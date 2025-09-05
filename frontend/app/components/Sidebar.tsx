'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Class Schedule', href: '/ClassSchedule', icon: '📅' },
    { name: 'Assignments', href: '/Assignments', icon: '📝' },
    { name: 'Exams', href: '/Exams', icon: '📋' }, 
    { name: 'Budget Tracker', href: '/BudgetTracker', icon: '💰' },
    { name: 'Notifications', href: '/Notifications', icon: '🔔' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Resources', href: '/resources', icon: '📚' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    closeSidebar();
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
        aria-label="Toggle sidebar"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header with Profile Picture */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <button
                onClick={handleProfileClick}
                className="w-20 h-20 rounded-full overflow-hidden shadow-lg hover:scale-110 transition-transform duration-200 mb-4 cursor-pointer"
              >
                <img
                  src="/profile.jfif"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
              <p className="text-sm text-gray-600">Computer Science</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${pathname === item.href ? 'bg-gray-200 font-semibold' : ''}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                router.push('/logout');
                closeSidebar();
              }}
              className="flex items-center w-full text-left text-red-600 hover:text-red-700"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay (no blur now) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
}
