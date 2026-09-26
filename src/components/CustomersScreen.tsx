import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Menu,
  Phone,
  CreditCard
} from 'lucide-react';
import { Customer } from '../types';

interface CustomersScreenProps {
  onOpenMobileMenu?: () => void;
  customers: Customer[];
  onOpenAddCustomer: () => void;
  onViewCustomerProfile: (customer: Customer) => void;
  onRecordTransactionForCustomer: (customerName: string) => void;
}

export const CustomersScreen: React.FC<CustomersScreenProps> = ({
  onOpenMobileMenu,
  customers,
  onOpenAddCustomer,
  onViewCustomerProfile,
  onRecordTransactionForCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [activeKebabId, setActiveKebabId] = useState<string | null>(null);
  const kebabRef = useRef<HTMLDivElement>(null);

  // Close kebab dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setActiveKebabId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter customers by search
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.contactNumber.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  const totalEntries = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + pageSize);

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

  return (
    <div id="customers-screen" className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
      {/* Header Area & Action Controls */}
      <header
        id="customers-header"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              id="customers-mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                id="customers-page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Customers
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage customer directory, balances, and credit limits
              </p>
            </div>
          </div>

          {/* Top Controls (Right-Aligned): Search Bar & Primary CTA */}
          <div
            id="customers-top-controls"
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
          >
            {/* Search Bar: Light outline input field with a search icon and placeholder text "Search customers..." */}
            <div className="relative flex-1 sm:w-64 lg:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="search-customers-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search customers..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Primary CTA: Bright orange/coral button labeled "+ Add Customer" */}
            <button
              type="button"
              id="add-customer-cta-btn"
              onClick={onOpenAddCustomer}
              className="py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-semibold text-sm rounded-lg shadow-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-4">
        {/* Customer Data Table Container */}
        <section
          id="customers-table-container"
          className="bg-white rounded-xl shadow-xs border border-gray-200/90 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table
              id="customers-data-table"
              className="w-full text-left border-collapse min-w-[640px]"
            >
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700">
                    CUSTOMER NAME
                  </th>
                  <th scope="col" className="py-3.5 px-6 font-semibold text-gray-700">
                    CONTACT NUMBER
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-6 font-semibold text-gray-700 text-right"
                  >
                    OUTSTANDING BALANCE
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-6 font-semibold text-gray-700 text-center w-28"
                  >
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm text-gray-800">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No customers found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((cust) => {
                    const initials = getInitials(cust.name);
                    const avatarColor = getAvatarColor(cust.name);
                    const isKebabOpen = activeKebabId === cust.id;

                    return (
                      <tr
                        key={cust.id}
                        id={`customer-row-${cust.id.toLowerCase()}`}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                        onClick={() => onViewCustomerProfile(cust)}
                      >
                        {/* CUSTOMER NAME: Full name with small circular avatar/initials */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${avatarColor} flex-shrink-0`}
                            >
                              {initials}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900 block leading-tight">
                                {cust.name}
                              </span>
                              <span className="text-[11px] text-gray-400 font-normal">
                                {cust.id} {cust.address ? `• ${cust.address}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT NUMBER */}
                        <td className="py-4 px-6 whitespace-nowrap text-gray-600 font-mono text-xs sm:text-sm">
                          {cust.contactNumber}
                        </td>

                        {/* OUTSTANDING BALANCE: Current unpaid balance in PHP formatted with currency symbol */}
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <span
                            className={`font-semibold text-sm ${
                              cust.outstandingBalance > 0
                                ? 'text-red-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            ₱{cust.outstandingBalance.toFixed(2)}
                          </span>
                        </td>

                        {/* ACTION: eye icon (View Profile) and three-dot kebab menu icon */}
                        <td
                          className="py-4 px-6 whitespace-nowrap text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Eye icon: View Profile */}
                            <button
                              type="button"
                              id={`view-profile-btn-${cust.id.toLowerCase()}`}
                              onClick={() => onViewCustomerProfile(cust)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                              title="View Profile"
                              aria-label={`View profile for ${cust.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Three-dot kebab menu icon */}
                            <div
                              className="relative inline-block text-left"
                              ref={isKebabOpen ? kebabRef : null}
                            >
                              <button
                                type="button"
                                id={`kebab-menu-btn-${cust.id.toLowerCase()}`}
                                onClick={() =>
                                  setActiveKebabId((prev) =>
                                    prev === cust.id ? null : cust.id
                                  )
                                }
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                title="More options"
                                aria-label="Customer options"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {isKebabOpen && (
                                <div
                                  id={`kebab-dropdown-${cust.id.toLowerCase()}`}
                                  className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 text-left"
                                >
                                  <button
                                    onClick={() => {
                                      onViewCustomerProfile(cust);
                                      setActiveKebabId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    View Full Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      onRecordTransactionForCustomer(cust.name);
                                      setActiveKebabId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                  >
                                    <CreditCard className="w-3.5 h-3.5 text-[#ea580c]" />
                                    Record Transaction
                                  </button>
                                  <a
                                    href={`tel:${cust.contactNumber}`}
                                    onClick={() => setActiveKebabId(null)}
                                    className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    Call / SMS
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div
            id="customers-footer-pagination"
            className="px-6 py-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            {/* Left Text: Small gray text reading "Showing 1 to 5 of 24 entries" */}
            <div
              id="customers-pagination-summary"
              className="text-xs sm:text-sm text-gray-500 font-normal order-2 sm:order-1"
            >
              Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of{' '}
              {totalEntries} entries
            </div>

            {/* Right Controls: Pagination buttons with an active orange page square (1), followed by standard numbered page buttons (2, 3), and a Next button */}
            <div
              id="customers-pagination-controls"
              className="flex items-center gap-1.5 order-1 sm:order-2"
            >
              {/* Optional Previous button if on page > 1 */}
              {currentPage > 1 && (
                <button
                  type="button"
                  id="customers-prev-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
              )}

              {/* Numbered page buttons with active orange page square */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    id={`customers-page-btn-${pageNumber}`}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#f97316] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                id="customers-next-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 transition-colors flex items-center gap-1 ${
                  currentPage >= totalPages
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
