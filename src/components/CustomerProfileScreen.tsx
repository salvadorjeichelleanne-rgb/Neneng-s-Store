import React, { useState, useMemo } from 'react';
import {
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Phone,
  MapPin,
  Menu,
  PlusCircle,
  CheckCircle2,
  Calendar,
  X,
  UserCheck
} from 'lucide-react';
import { Customer, TransactionType } from '../types';

export interface CustomerHistoryItem {
  id: string;
  date: string;
  type: TransactionType;
  itemsNotes: string;
  amount: number;
  runningBalance: number;
}

const DEFAULT_TRANSACTIONS: CustomerHistoryItem[] = [
  {
    id: 'TXN-JD-01',
    date: '08/28/2026',
    type: 'Utang',
    itemsNotes: 'Noodles, Coffee',
    amount: 200.0,
    runningBalance: 350.0
  },
  {
    id: 'TXN-JD-02',
    date: '08/15/2026',
    type: 'Payment',
    itemsNotes: 'Partial Payment',
    amount: 150.0,
    runningBalance: 150.0
  },
  {
    id: 'TXN-JD-03',
    date: '08/01/2026',
    type: 'Utang',
    itemsNotes: 'Soap, Shampoo',
    amount: 300.0,
    runningBalance: 300.0
  },
  {
    id: 'TXN-JD-04',
    date: '07/20/2026',
    type: 'Payment',
    itemsNotes: 'Full Settlement',
    amount: 250.0,
    runningBalance: 0.0
  },
  {
    id: 'TXN-JD-05',
    date: '07/10/2026',
    type: 'Utang',
    itemsNotes: 'Cooking Oil, Eggs',
    amount: 250.0,
    runningBalance: 250.0
  },
  {
    id: 'TXN-JD-06',
    date: '06/28/2026',
    type: 'Payment',
    itemsNotes: 'Cash Payment',
    amount: 180.0,
    runningBalance: 0.0
  },
  {
    id: 'TXN-JD-07',
    date: '06/15/2026',
    type: 'Utang',
    itemsNotes: 'Canned Goods, Rice 2kg',
    amount: 180.0,
    runningBalance: 180.0
  },
  {
    id: 'TXN-JD-08',
    date: '05/30/2026',
    type: 'Payment',
    itemsNotes: 'Bayad utang',
    amount: 120.0,
    runningBalance: 0.0
  },
  {
    id: 'TXN-JD-09',
    date: '05/18/2026',
    type: 'Utang',
    itemsNotes: 'Milk powder, Sugar',
    amount: 120.0,
    runningBalance: 120.0
  },
  {
    id: 'TXN-JD-10',
    date: '04/22/2026',
    type: 'Payment',
    itemsNotes: 'Partial Payment',
    amount: 100.0,
    runningBalance: 0.0
  },
  {
    id: 'TXN-JD-11',
    date: '04/10/2026',
    type: 'Utang',
    itemsNotes: 'Snacks, Soft drinks',
    amount: 100.0,
    runningBalance: 100.0
  },
  {
    id: 'TXN-JD-12',
    date: '03/15/2026',
    type: 'Utang',
    itemsNotes: 'Initial store credit',
    amount: 50.0,
    runningBalance: 50.0
  }
];

interface CustomerProfileScreenProps {
  customer?: Customer;
  onOpenMobileMenu?: () => void;
  onBackToCustomers: () => void;
  onOpenUtang: (customerName: string) => void;
  onOpenPayment: (customerName: string) => void;
  onUpdateCustomer?: (updated: Customer) => void;
}

export const CustomerProfileScreen: React.FC<CustomerProfileScreenProps> = ({
  customer: propCustomer,
  onOpenMobileMenu,
  onBackToCustomers,
  onOpenUtang,
  onOpenPayment,
  onUpdateCustomer
}) => {
  // Fallback to Juan Dela Cruz if no specific customer selected
  const activeCustomer: Customer = propCustomer || {
    id: 'CUST-001',
    name: 'Juan Dela Cruz',
    contactNumber: '09123456780',
    outstandingBalance: 350.0,
    creditLimit: 1000.0,
    address: 'Block 4, Lot 12, Purok 1',
    joinedDate: 'Jan 15, 2024'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Utang' | 'Payment'>('All');
  const [history] = useState<CustomerHistoryItem[]>(DEFAULT_TRANSACTIONS);
  const [page, setPage] = useState(1);
  const pageSize = 3; // Exactly 3 per page to display "Showing 3 of 12 transactions"

  // Edit Customer Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(activeCustomer.name);
  const [editContact, setEditContact] = useState(activeCustomer.contactNumber);
  const [editAddress, setEditAddress] = useState(activeCustomer.address || 'Block 4, Lot 12, Purok 1');

  // Filtered transactions
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesType = filterType === 'All' || item.type === filterType;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.itemsNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery) ||
        item.amount.toString().includes(searchQuery);
      return matchesType && matchesSearch;
    });
  }, [history, filterType, searchQuery]);

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, page, pageSize]);

  // Initials for avatar
  const initials = activeCustomer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editContact.trim()) return;

    if (onUpdateCustomer) {
      onUpdateCustomer({
        ...activeCustomer,
        name: editName.trim(),
        contactNumber: editContact.trim(),
        address: editAddress.trim()
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div
      id="customer-profile-screen"
      className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] min-h-screen text-gray-900"
    >
      {/* Top Bar with Global Search & User Profile Indicator */}
      <header
        id="profile-top-bar"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-3.5 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              id="mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="global-search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search customers, transactions..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
              />
            </div>
          </div>

          {/* Right: Notification Bell & User Profile Indicator */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              id="notification-bell-btn"
              className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            <div className="h-6 w-px bg-gray-200" />

            {/* Profile Avatar & Label */}
            <div id="user-profile-indicator" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] flex items-center justify-center font-bold text-xs shadow-2xs">
                SO
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900 leading-tight">Store Owners</p>
                <p className="text-[11px] text-gray-500 leading-tight">Ederlyn &amp; Roderick Salas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Breadcrumb Link: < Back to Customers */}
        <div>
          <button
            type="button"
            id="breadcrumb-back-to-customers"
            onClick={onBackToCustomers}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#064e3b] transition-colors cursor-pointer group focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-[#064e3b] transition-transform group-hover:-translate-x-0.5" />
            <span>&lt; Back to Customers</span>
          </button>
        </div>

        {/* Customer Summary Card (Top Section): Split Left Details Box & Right Balance Box */}
        <section
          id="customer-summary-card"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* Left Details Box */}
          <div
            id="customer-details-box"
            className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Gray circular avatar displaying customer initials (JD) */}
                <div
                  id="customer-avatar-initials"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-2xs"
                >
                  {initials}
                </div>

                <div className="space-y-1">
                  {/* Bold title "Juan Dela Cruz" */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1
                      id="customer-profile-name"
                      className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-snug"
                    >
                      {activeCustomer.name}
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Customer
                    </span>
                  </div>

                  {/* Contact Info (09123456780) */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span id="customer-profile-contact" className="font-mono">
                      {activeCustomer.contactNumber}
                    </span>
                  </div>

                  {/* Address Snippet (Block 4, Lot 12, Purok 1) */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span id="customer-profile-address" className="line-clamp-1">
                      {activeCustomer.address || 'Block 4, Lot 12, Purok 1'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pencil edit icon button labeled "Edit" */}
              <button
                type="button"
                id="edit-customer-btn"
                onClick={() => {
                  setEditName(activeCustomer.name);
                  setEditContact(activeCustomer.contactNumber);
                  setEditAddress(activeCustomer.address || 'Block 4, Lot 12, Purok 1');
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                <span>Edit</span>
              </button>
            </div>

            {/* Sub-info bar */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Customer since {activeCustomer.joinedDate || 'Jan 15, 2024'}</span>
              </div>
              <div>
                <span>Credit Limit: </span>
                <span className="font-semibold text-gray-700 font-mono">
                  ₱{(activeCustomer.creditLimit || 1000).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Balance Box */}
          <div
            id="customer-balance-box"
            className="lg:col-span-5 bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-6 flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Small red header "OUTSTANDING BALANCE" */}
              <p
                id="outstanding-balance-label"
                className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1"
              >
                OUTSTANDING BALANCE
              </p>

              {/* Large bold red text "₱350.00" */}
              <div className="flex items-baseline gap-2">
                <span
                  id="outstanding-balance-amount"
                  className="text-3xl sm:text-4xl font-extrabold text-[#dc2626] font-mono tracking-tight"
                >
                  ₱{activeCustomer.outstandingBalance.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-red-600/80 mt-1">
                Due as of today. Store credit limit remaining: ₱
                {Math.max(0, (activeCustomer.creditLimit || 1000) - activeCustomer.outstandingBalance).toFixed(2)}
              </p>
            </div>

            {/* Two Action CTAs: + Utang (Orange) and ₱ Pay (Emerald Green) */}
            <div className="mt-6 pt-4 border-t border-red-200/60 grid grid-cols-2 gap-3">
              {/* Solid orange button labeled "+ Utang" */}
              <button
                type="button"
                id="cta-add-utang-btn"
                onClick={() => onOpenUtang(activeCustomer.name)}
                className="w-full py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Utang</span>
              </button>

              {/* Solid emerald green button labeled "₱ Pay" */}
              <button
                type="button"
                id="cta-record-payment-btn"
                onClick={() => onOpenPayment(activeCustomer.name)}
                className="w-full py-2.5 px-4 bg-[#064e3b] hover:bg-[#043d2e] active:bg-[#022c22] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>₱ Pay</span>
              </button>
            </div>
          </div>
        </section>

        {/* Transaction History Section */}
        <section
          id="customer-transaction-history-section"
          className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden"
        >
          {/* Section Header Bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            {/* Left-aligned heading "Transaction History" */}
            <div>
              <h2
                id="section-heading-transaction-history"
                className="text-base sm:text-lg font-bold text-gray-900 tracking-tight"
              >
                Transaction History
              </h2>
              <p className="text-xs text-gray-500">
                Detailed credit charges and payment vouchers for {activeCustomer.name}
              </p>
            </div>

            {/* Right-aligned dropdown filter selector labeled "All Transactions ⌄" */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="filter-type-select" className="text-xs text-gray-500 font-medium">
                Filter:
              </label>
              <div className="relative">
                <select
                  id="filter-type-select"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as 'All' | 'Utang' | 'Payment');
                    setPage(1);
                  }}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] cursor-pointer"
                >
                  <option value="All">All Transactions ⌄</option>
                  <option value="Utang">Utang Only</option>
                  <option value="Payment">Payments Only</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                  ⌄
                </span>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table id="customer-transactions-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6">DATE</th>
                  <th className="py-3.5 px-6">TYPE</th>
                  <th className="py-3.5 px-6">ITEMS/NOTES</th>
                  <th className="py-3.5 px-6 text-right">AMOUNT</th>
                  <th className="py-3.5 px-6 text-right">RUNNING BALANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {paginatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No transactions found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* DATE */}
                      <td className="py-3.5 px-6 text-gray-700 font-medium whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* TYPE: Pill tags indicating transaction type (Utang in red, Payment in green) */}
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {item.type === 'Utang' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Utang
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Payment
                          </span>
                        )}
                      </td>

                      {/* ITEMS/NOTES */}
                      <td className="py-3.5 px-6 text-gray-800 font-medium">
                        {item.itemsNotes}
                      </td>

                      {/* AMOUNT (+₱200.00, -₱150.00, +₱300.00) */}
                      <td
                        className={`py-3.5 px-6 text-right font-mono font-semibold whitespace-nowrap ${
                          item.type === 'Utang' ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {item.type === 'Utang' ? '+' : '-'}₱{item.amount.toFixed(2)}
                      </td>

                      {/* RUNNING BALANCE */}
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                        ₱{item.runningBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Left text "Showing 3 of 12 transactions" & right chevron page navigation */}
          <div
            id="transactions-table-footer"
            className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 text-xs text-gray-600"
          >
            {/* Left text reading "Showing 3 of 12 transactions" */}
            <p id="table-footer-summary" className="font-medium text-gray-500">
              Showing {paginatedHistory.length} of {filteredHistory.length} transactions
            </p>

            {/* Right simple chevron page navigation buttons (< >) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="pagination-prev-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-700 font-semibold transition-colors cursor-pointer shadow-2xs"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 text-xs font-semibold text-gray-700">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                id="pagination-next-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-700 font-semibold transition-colors cursor-pointer shadow-2xs"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div
          id="edit-customer-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#064e3b]" />
                <h3 className="text-lg font-bold text-gray-900">Edit Customer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#064e3b] hover:bg-[#043d2e] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
