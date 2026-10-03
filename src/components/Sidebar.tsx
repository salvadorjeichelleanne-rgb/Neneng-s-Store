import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  History,
  BarChart3,
  Settings,
  LogOut,
  Store,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
  storeName?: string;
  storeOwners?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  activeItem = 'Transaction History',
  onSelectItem,
  storeName = "Neneng's Store",
  storeOwners = "Ederlyn & Roderick Salas"
}) => {
  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Customers', icon: Users },
    { name: 'Credit / Utang', icon: CreditCard },
    { name: 'Payments', icon: Receipt },
    { name: 'Transaction History', icon: History },
    { name: 'Reports', icon: BarChart3 }
  ];

  const bottomMenuItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Logout', icon: LogOut }
  ];

  const handleItemClick = (name: string) => {
    if (onSelectItem) {
      onSelectItem(name);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between w-64 bg-[#064e3b] text-white transition-transform duration-200 ease-in-out border-r border-[#043d2e] overflow-x-hidden
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Header & Circular Store Logo */}
          <div className="flex items-center justify-between p-5 pb-4 border-b border-emerald-800/60 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Circular store logo */}
              <div
                id="sidebar-store-logo"
                className="w-10 h-10 rounded-full bg-emerald-700/80 border-2 border-emerald-400/40 flex items-center justify-center shadow-inner text-emerald-100 shrink-0"
              >
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className="font-bold text-base tracking-tight text-white leading-tight truncate"
                  title={storeName}
                >
                  {storeName}
                </span>
                <span
                  className="text-xs text-emerald-200/80 font-medium tracking-wide truncate"
                  title={storeOwners}
                >
                  {storeOwners}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                id="close-sidebar-mobile-btn"
                onClick={onCloseMobile}
                className="p-1 rounded-md text-emerald-300 hover:text-white hover:bg-emerald-800 lg:hidden shrink-0 ml-1 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Main Navigation Menu */}
          <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-x-hidden" aria-label="Main menu">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-emerald-300/60 uppercase">
              Menu
            </div>
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  id={`nav-item-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleItemClick(item.name)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150 text-left
                    ${
                      isActive
                        ? 'bg-white text-emerald-950 font-semibold shadow-sm'
                        : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/60'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-emerald-900' : 'text-emerald-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Menu: Settings, Logout */}
        <div className="p-3.5 border-t border-emerald-800/60 space-y-1 bg-[#054333] shrink-0 overflow-x-hidden">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isLogout = item.name === 'Logout';

            return (
              <button
                key={item.name}
                id={`nav-item-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleItemClick(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm font-medium transition-colors text-left
                  ${
                    isLogout
                      ? 'text-red-200 hover:text-white hover:bg-red-900/40'
                      : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/60'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isLogout ? 'text-red-300' : 'text-emerald-200'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
