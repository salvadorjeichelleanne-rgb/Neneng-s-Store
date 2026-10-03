import React from 'react';
import { Menu } from 'lucide-react';
import { TopbarUserStatus } from './TopbarUserStatus';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  storeOwners?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  storeOwners = 'Ederlyn & Roderick Salas'
}) => {
  return (
    <header
      id="main-header"
      className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Mobile menu toggle, Breadcrumb, Page Header & Subtitle */}
        <div className="flex items-start gap-3">
          {/* Mobile hamburger button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={onOpenMobileMenu}
            className="mt-1 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
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

        {/* Right: Consistent Notification Bell & SO Profile Avatar */}
        <TopbarUserStatus storeOwners={storeOwners} />
      </div>
    </header>
  );
};
