import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, User, Check, AlertCircle } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'Credit Limit Alert',
      desc: 'Juan Dela Cruz has an outstanding credit balance of ₱350.00.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Received',
      desc: 'Maria Santos paid ₱300.00 towards her balance.',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'Full Settlement',
      desc: 'Ana Garcia completed full payment (₱250.00).',
      time: 'Yesterday',
      unread: false
    }
  ];

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header
      id="main-header"
      className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle, Breadcrumb, Page Header & Subtitle */}
        <div className="flex items-start gap-3">
          {/* Mobile hamburger button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={onOpenMobileMenu}
            className="mt-1 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            {/* Breadcrumb Title */}
            <div id="breadcrumb-title" className="text-xs font-medium text-emerald-700 uppercase tracking-wider mb-1">
              Transactions
            </div>

            {/* Page Header */}
            <h1
              id="page-header"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              Transaction History
            </h1>

            {/* Subtitle */}
            <p id="page-subtitle" className="text-sm text-gray-500 mt-1">
              View and monitor all customer credit and payment transactions.
            </p>
          </div>
        </div>

        {/* Right: User Status (Bell & Avatar with label Store Owner) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  id="notification-badge"
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full animate-pulse"
                />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between px-4 pb-2.5 border-b border-gray-100">
                  <span className="font-semibold text-sm text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      id="mark-all-read-btn"
                      onClick={handleMarkAllRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-gray-50 transition-colors ${
                        n.unread && unreadCount > 0 ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 text-emerald-600">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.desc}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Status: Avatar with label "Store Owner" */}
          <div
            id="user-status-card"
            className="flex items-center gap-3 pl-2 sm:pl-3 sm:border-l border-gray-200"
          >
            <div
              id="user-avatar"
              className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300/60 flex items-center justify-center text-emerald-800 font-semibold shadow-xs"
            >
              <User className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span id="user-name" className="text-sm font-semibold text-gray-900 leading-tight">
                Ederlyn &amp; Roderick Salas
              </span>
              <span id="user-role-label" className="text-xs text-gray-500 font-medium">
                Store Owners &bull; 6:00 AM - 8:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
