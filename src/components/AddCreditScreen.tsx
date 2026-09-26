import React, { useState } from 'react';
import { ArrowLeft, Menu, Calendar } from 'lucide-react';
import { Customer, Transaction } from '../types';

interface AddCreditScreenProps {
  customers: Customer[];
  defaultCustomerName?: string;
  onOpenMobileMenu?: () => void;
  onBack: () => void;
  onSaveTransaction: (transaction: Transaction) => void;
}

export const AddCreditScreen: React.FC<AddCreditScreenProps> = ({
  customers,
  defaultCustomerName = '',
  onOpenMobileMenu,
  onBack,
  onSaveTransaction
}) => {
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [description, setDescription] = useState('');
  const [totalItems, setTotalItems] = useState('');
  const [amount, setAmount] = useState('');
  // Pre-filled date as specified: 10/28/2023
  const [transactionDate, setTransactionDate] = useState('2023-10-28');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || customerName === '') {
      setError('Please select a customer.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description or items list.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid total amount.');
      return;
    }

    // Format date for display (e.g. 10/28/2023)
    const [year, month, day] = transactionDate.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    const matchedCustomer = customers.find(
      (c) => c.name.toLowerCase() === customerName.toLowerCase()
    );
    const customerId = matchedCustomer ? matchedCustomer.id : 'CUST-001';
    const runningBalance = (matchedCustomer ? matchedCustomer.outstandingBalance : 0) + numAmount;

    const newTxn: Transaction = {
      id: `TXN-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: formattedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: customerName,
      customerId: customerId,
      type: 'Utang',
      amount: numAmount,
      balance: runningBalance,
      status: 'Unpaid',
      description: description.trim(),
      notes: totalItems ? `${totalItems} items recorded` : undefined
    };

    onSaveTransaction(newTxn);
  };

  return (
    <div id="add-credit-screen" className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] min-h-screen">
      {/* Navigation Header */}
      <header
        id="add-credit-header"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
      >
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Mobile menu button for small screens */}
            <button
              id="add-credit-mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Left-aligned back arrow button (←) */}
            <button
              type="button"
              id="back-btn"
              onClick={onBack}
              className="p-2 -ml-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Header Titles */}
            <div>
              <h1
                id="add-credit-page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Add Utang / Record Credit
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Record a new credit transaction for a customer
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-4xl w-full mx-auto flex items-start justify-center">
        {/* Centered Credit Form Card with elevated drop-shadow styling */}
        <div
          id="credit-form-card"
          className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-10 w-full max-w-2xl transition-all"
        >
          {error && (
            <div
              id="add-credit-error-alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-800 text-xs font-semibold uppercase tracking-wider ml-3 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name Field: dropdown menu field with placeholder text "Select a customer..." */}
            <div>
              <label
                htmlFor="customer-name-select"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Customer Name
              </label>
              <div className="relative">
                <select
                  id="customer-name-select"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select a customer...
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} {c.outstandingBalance > 0 ? `(Balance: ₱${c.outstandingBalance.toFixed(2)})` : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Description / Items: multi-line text area with placeholder text "e.g., 2 kg rice, 1 canned sardines..." */}
            <div>
              <label
                htmlFor="description-items-textarea"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Description / Items
              </label>
              <textarea
                id="description-items-textarea"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g., 2 kg rice, 1 canned sardines..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs resize-y leading-relaxed"
              />
            </div>

            {/* Two-Column Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Items (Optional) */}
              <div>
                <label
                  htmlFor="total-items-input"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Total Items (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  id="total-items-input"
                  value={totalItems}
                  onChange={(e) => setTotalItems(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs"
                />
              </div>

              {/* Total Amount: currency prefix icon (₱), numeric placeholder "0.00" */}
              <div>
                <label
                  htmlFor="total-amount-input"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Total Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold text-base">
                    ₱
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="total-amount-input"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Transaction Date: date-picker input displaying pre-filled date (10/28/2023) */}
            <div>
              <label
                htmlFor="transaction-date-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Transaction Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="transaction-date-input"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs cursor-pointer"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Formatted as 10/28/2023 for receipts and ledger entries.
              </p>
            </div>

            {/* Action Buttons (Bottom Right) */}
            <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
              {/* Secondary Action: Gray outline button labeled "Cancel" */}
              <button
                type="button"
                id="cancel-credit-btn"
                onClick={onBack}
                className="py-2.5 px-5 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>

              {/* Primary Action: Solid orange/coral button labeled "Save Transaction" */}
              <button
                type="submit"
                id="save-credit-transaction-btn"
                className="py-2.5 px-6 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
