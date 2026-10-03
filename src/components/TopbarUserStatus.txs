import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TopbarUserStatusProps {
  storeOwners?: string;
}

export const TopbarUserStatus: React.FC<TopbarUserStatusProps> = ({
  storeOwners = 'Ederlyn & Roderick Salas'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: 'Unpaid Utang Alert',
      desc: 'Juan Dela Cruz has an outstanding balance of ₱350.00.',
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
      desc: 'Ana Garcia completed full repayment (₱250.00).',
      time: 'Yesterday',
      unread: false
    }
  ];

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div id="topbar-user-status" className="flex items-center gap-3 sm:gap-4 shrink-0">
      {/* Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id="topbar-notification-bell-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Notifications Popover Dropdown */}
        {showNotifications && (
          <div
            id="topbar-notifications-popover"
            className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex items-center justify-between px-4 pb-2.5 border-b border-gray-100">
              <span className="font-bold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-gray-50 transition-colors ${
                    n.unread && unreadCount > 0 ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-emerald-600 shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 leading-tight">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {n.desc}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* Profile Avatar & Label (SO for Store Owners) */}
      <div className="flex items-center gap-2.5">
        <div
          id="topbar-so-avatar"
          className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] flex items-center justify-center font-bold text-xs shadow-2xs shrink-0"
        >
          SO
        </div>
        <div className="hidden sm:block text-left max-w-[160px] truncate">
          <p className="text-xs font-semibold text-gray-900 leading-tight">Store Owners</p>
          <p className="text-[11px] text-gray-500 leading-tight truncate">
            {storeOwners}
          </p>
        </div>
      </div>
    </div>
  );
};
