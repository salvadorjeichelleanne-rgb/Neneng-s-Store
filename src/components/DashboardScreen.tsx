import React, { useState, useRef, useEffect } from 'react';
import {
  CreditCard,
  Receipt,
  Users,
  ArrowLeftRight,
  TrendingUp,
  Plus,
  MoreVertical,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  Menu
} from 'lucide-react';
import { Transaction } from '../types';

interface DashboardScreenProps {
  onOpenMobileMenu?: () => void;
  onOpenNewTransaction: () => void;
  onViewAllTransactions: () => void;
  recentTransactions: Transaction[];
  onViewDetails: (t: Transaction) => void;
  onPrintTransaction: (t: Transaction) => void;
  onToggleStatus: (id: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenMobileMenu,
  onOpenNewTransaction,
  onViewAllTransactions,
  recentTransactions,
  onViewDetails,
  onPrintTransaction,
  onToggleStatus
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-teal-100 text-teal-800 border-teal-200'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  // First 4 or 5 recent transactions
  const displayRecent = recentTransactions.slice(0, 5);

  return (
    <div id="dashboard-main-area" className="flex-1 flex flex-col min-w-0">
      {/* Header Area */}
      <header
        id="dashboard-header"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              id="dashboard-mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1
                id="dashboard-page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Dashboard
              </h1>
              <div id="dashboard-page-subtitle" className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-sm text-gray-500 font-medium">
                  Salas Store &bull; Owners: Ederlyn &amp; Roderick Salas
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  Hours: 6:00 AM - 8:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Top-Right CTA: Bright orange/coral button */}
          <button
            type="button"
            id="new-transaction-cta-btn"
            onClick={onOpenNewTransaction}
            className="self-start sm:self-auto py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-semibold text-sm rounded-lg shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Metric Cards (4 Grid Columns) */}
        <section
          id="metric-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {/* 1. Outstanding Credit Card: Pink icon tint | Metric: ₱5,000.00 | Label: "Outstanding Credit" | Small percentage badge */}
          <div
            id="metric-card-outstanding-credit"
            className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <span
                id="percentage-badge-outstanding"
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100"
              >
                <TrendingUp className="w-3 h-3" />
                +2.5%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900 tracking-tight block">
                ₱5,000.00
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5 block">
                Outstanding Credit
              </span>
            </div>
          </div>

          {/* 2. Payments Today Card: Light green icon tint | Metric: ₱1,250.00 | Label: "Payments Today" | Small percentage badge */}
          <div
            id="metric-card-payments-today"
            className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Receipt className="w-5 h-5" />
              </div>
              <span
                id="percentage-badge-payments"
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                <TrendingUp className="w-3 h-3" />
                +12%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900 tracking-tight block">
                ₱1,250.00
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5 block">
                Payments Today
              </span>
            </div>
          </div>

          {/* 3. Total Customers Card: Light blue icon tint | Metric: 12 | Label: "Total Customers" */}
          <div
            id="metric-card-total-customers"
            className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900 tracking-tight block">
                12
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5 block">
                Total Customers
              </span>
            </div>
          </div>

          {/* 4. Total Transactions Card: Light purple icon tint | Metric: 25 | Label: "Total Transactions" */}
          <div
            id="metric-card-total-transactions"
            className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-900 tracking-tight block">
                25
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5 block">
                Total Transactions
              </span>
            </div>
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section
          id="recent-transactions-section"
          className="bg-white rounded-xl shadow-xs border border-gray-200/90 overflow-hidden"
        >
          {/* Section Header: Left-aligned "Recent Transactions" with right-aligned "View All" */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2
              id="recent-transactions-heading"
              className="text-base sm:text-lg font-bold text-gray-900"
            >
              Recent Transactions
            </h2>
            <button
              type="button"
              id="recent-transactions-view-all-link"
              onClick={onViewAllTransactions}
              className="text-xs sm:text-sm font-semibold text-[#c2410c] hover:text-[#ea580c] transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table
              id="recent-transactions-table"
              className="w-full text-left border-collapse min-w-[640px]"
            >
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700">
                    CUSTOMER
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700">
                    TYPE
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700 text-right">
                    AMOUNT
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700 text-center">
                    STATUS
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 font-semibold text-gray-700 text-center w-14"
                  >
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm text-gray-800">
                {displayRecent.map((txn) => {
                  const isMenuOpen = activeMenuId === txn.id;
                  const initials = getInitials(txn.customer);
                  const avatarColor = getAvatarColor(txn.customer);

                  return (
                    <tr
                      key={txn.id}
                      id={`recent-row-${txn.id.toLowerCase()}`}
                      onClick={() => onViewDetails(txn)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      {/* CUSTOMER: Avatar initials + Full Name */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${avatarColor} flex-shrink-0`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block leading-tight">
                              {txn.customer}
                            </span>
                            <span className="text-[11px] text-gray-400 font-normal">
                              {txn.date} • {txn.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {txn.type === 'Utang' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Utang
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Payment
                          </span>
                        )}
                      </td>

                      {/* AMOUNT in PHP */}
                      <td className="py-4 px-6 whitespace-nowrap text-right font-semibold text-gray-900">
                        ₱{txn.amount.toFixed(2)}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        {txn.status === 'Paid' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* ACTION Menu icon / buttons */}
                      <td className="py-4 px-4 whitespace-nowrap text-center relative">
                        <div
                          className="relative inline-block text-left"
                          ref={isMenuOpen ? menuRef : null}
                        >
                          <button
                            type="button"
                            id={`recent-action-btn-${txn.id.toLowerCase()}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId((prev) => (prev === txn.id ? null : txn.id));
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              id={`recent-action-dropdown-${txn.id.toLowerCase()}`}
                              className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 text-left"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  onViewDetails(txn);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-400" />
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  onPrintTransaction(txn);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                              >
                                <Printer className="w-3.5 h-3.5 text-gray-400" />
                                Print Receipt
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => {
                                  onToggleStatus(txn.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                              >
                                {txn.status === 'Paid' ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                                    Mark as Unpaid
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    Mark as Paid
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
