import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Bell,
  Menu,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronDown,
  User,
  ArrowRight,
  Search
} from 'lucide-react';
import { Customer, Transaction } from '../types';

interface RecordPaymentScreenProps {
  customers: Customer[];
  defaultCustomerName?: string;
  onOpenMobileMenu?: () => void;
  onSavePayment: (transaction: Transaction) => void;
  onCancel?: () => void;
}

export const RecordPaymentScreen: React.FC<RecordPaymentScreenProps> = ({
  customers,
  defaultCustomerName,
  onOpenMobileMenu,
  onSavePayment,
  onCancel
}) => {
  // Select Juan Dela Cruz by default or prop
  const initialCustomer = useMemo(() => {
    if (defaultCustomerName) {
      const found = customers.find((c) => c.name === defaultCustomerName);
      if (found) return found;
    }
    const juan = customers.find((c) => c.name.toLowerCase().includes('juan'));
    return juan || customers[0] || {
      id: 'CUST-001',
      name: 'Juan Dela Cruz',
      contactNumber: '09123456780',
      outstandingBalance: 350.0,
      creditLimit: 1000.0
    };
  }, [customers, defaultCustomerName]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomer.id);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    };
    if (isCustomerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomerDropdownOpen]);

  // Selected customer object
  const currentCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || initialCustomer;
  }, [customers, selectedCustomerId, initialCustomer]);

  // Payment form state
  // Default payment amount populated with "350.00" as requested
  const [paymentAmount, setPaymentAmount] = useState<string>(
    currentCustomer.outstandingBalance.toFixed(2)
  );

  // Pre-filled timestamp "08/28/2026"
  const [dateValue, setDateValue] = useState<string>('2026-08-28');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // When customer changes, optionally sync default payment amount
  useEffect(() => {
    setPaymentAmount(currentCustomer.outstandingBalance.toFixed(2));
  }, [currentCustomer.id]);

  // Calculation for Dynamic Feedback Box
  const numAmount = parseFloat(paymentAmount) || 0;
  const currentBalance = currentCustomer.outstandingBalance;
  const remainingBalance = Math.max(0, currentBalance - numAmount);
  const isFullPayment = numAmount >= currentBalance && currentBalance > 0;
  const isPartialPayment = numAmount > 0 && numAmount < currentBalance;
  const isOverPayment = numAmount > currentBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) {
      setError('Please enter a valid payment amount greater than zero.');
      return;
    }

    const [year, month, day] = dateValue.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    const newTxn: Transaction = {
      id: `TXN-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: formattedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: currentCustomer.name,
      customerId: currentCustomer.id,
      type: 'Payment',
      amount: numAmount,
      balance: remainingBalance,
      status: 'Paid',
      description: isFullPayment ? 'Full Settlement Payment' : 'Partial Credit Payment',
      notes: notes.trim() || undefined
    };

    onSavePayment(newTxn);
  };

  return (
    <div
      id="record-payment-screen"
      className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] min-h-screen text-gray-900"
    >
      {/* Top Bar */}
      <header
        id="record-payment-top-bar"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & Page Header */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1
                id="record-payment-header"
                className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Record Payment
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Receive and record customer credit settlements
              </p>
            </div>
          </div>

          {/* Right: User Status */}
          <div id="topbar-user-status" className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              id="notification-bell-btn"
              className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-gray-200" />

            {/* Profile Avatar & Label */}
            <div className="flex items-center gap-2.5">
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
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-10 max-w-4xl w-full mx-auto">
        <div className="w-full max-w-xl mx-auto space-y-6">
          {error && (
            <div
              id="payment-error-banner"
              className="p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-800 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Current Balance Highlight Card */}
          <div
            id="current-balance-card"
            className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 relative z-20"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                {/* Uppercase text "CURRENT BALANCE" */}
                <p
                  id="current-balance-heading"
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1"
                >
                  CURRENT BALANCE
                </p>

                {/* Large bold orange balance display "₱350.00" */}
                <p
                  id="current-balance-display"
                  className="text-3xl sm:text-4xl font-extrabold text-[#f97316] font-mono tracking-tight"
                >
                  ₱{currentBalance.toFixed(2)}
                </p>

                <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold text-gray-800">{currentCustomer.name}</span>
                  <span className="text-gray-400">({currentCustomer.contactNumber})</span>
                </p>
              </div>

              {/* Customer selection drop-down icon button on the right */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="customer-dropdown-toggle-btn"
                  onClick={() => {
                    setIsCustomerDropdownOpen(!isCustomerDropdownOpen);
                    setCustomerSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                >
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">
                    {currentCustomer.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isCustomerDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Popup with Smooth Scrolling */}
                {isCustomerDropdownOpen && (
                  <div
                    id="customer-dropdown-menu"
                    className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    {/* Header & Quick Search */}
                    <div className="p-2.5 bg-gray-50/80 border-b border-gray-100">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                          placeholder="Search customer..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="max-h-56 overflow-y-auto divide-y divide-gray-50 overscroll-contain">
                      {customers
                        .filter((cust) =>
                          cust.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
                        )
                        .map((cust) => (
                          <button
                            key={cust.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(cust.id);
                              setIsCustomerDropdownOpen(false);
                              if (error) setError('');
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                              cust.id === currentCustomer.id
                                ? 'bg-emerald-50/80 text-[#064e3b] font-semibold'
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="truncate text-xs font-medium text-gray-900">
                                {cust.name}
                              </p>
                              <p className="text-[10px] text-gray-400">{cust.contactNumber}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span
                                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                                  cust.outstandingBalance > 0
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                }`}
                              >
                                ₱{cust.outstandingBalance.toFixed(2)}
                              </span>
                            </div>
                          </button>
                        ))}
                      {customers.filter((cust) =>
                        cust.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-4 text-xs text-center text-gray-400">
                          No customers found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form Controls Card */}
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-5"
          >
            {/* Payment Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="payment-amount-input"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Payment Amount
                </label>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(currentBalance.toFixed(2))}
                  className="text-xs font-semibold text-[#064e3b] hover:text-emerald-700 underline cursor-pointer"
                >
                  Pay Full Balance (₱{currentBalance.toFixed(2)})
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold text-base">
                  ₱
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="payment-amount-input"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="350.00"
                  className="w-full pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-colors shadow-2xs font-mono font-medium"
                />
              </div>
            </div>

            {/* Date Field */}
            <div>
              <label
                htmlFor="payment-date-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="payment-date-input"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-colors shadow-2xs cursor-pointer"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Display timestamp: 08/28/2026
              </p>
            </div>

            {/* Notes Field: Label "Notes (Optional)", text input box with placeholder "Add a note about this payment..." */}
            <div>
              <label
                htmlFor="payment-notes-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Notes (Optional)
              </label>
              <input
                type="text"
                id="payment-notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note about this payment..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-colors shadow-2xs"
              />
            </div>

            {/* Dynamic Feedback Box: Light green highlight container with green checkmark icon, bold text reading "Remaining Balance: ₱0.00", and subtext */}
            <div
              id="dynamic-feedback-box"
              className={`p-4 rounded-xl border transition-all ${
                isFullPayment
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : isPartialPayment
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : isOverPayment
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isFullPayment
                      ? 'text-emerald-600'
                      : isPartialPayment
                      ? 'text-amber-600'
                      : isOverPayment
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                />
                <div className="space-y-0.5">
                  <p id="remaining-balance-text" className="text-sm sm:text-base font-bold">
                    Remaining Balance: ₱{remainingBalance.toFixed(2)}
                  </p>
                  <p id="feedback-subtext" className="text-xs opacity-90">
                    {isFullPayment
                      ? "This payment will fully clear the customer's debt."
                      : isPartialPayment
                      ? `Partial payment. Customer will have ₱${remainingBalance.toFixed(2)} remaining debt.`
                      : isOverPayment
                      ? `Full payment plus ₱${(numAmount - currentBalance).toFixed(2)} advance/change.`
                      : 'Enter a payment amount to see remaining balance calculation.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              {onCancel && (
                <button
                  type="button"
                  id="cancel-payment-btn"
                  onClick={onCancel}
                  className="py-2.5 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                id="submit-payment-btn"
                className="py-2.5 px-6 bg-[#064e3b] hover:bg-[#043d2e] active:bg-[#022c22] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
              >
                <span>Confirm &amp; Record Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
