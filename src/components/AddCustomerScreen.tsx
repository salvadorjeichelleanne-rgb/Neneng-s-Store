import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { Customer } from '../types';

interface AddCustomerScreenProps {
  onOpenMobileMenu?: () => void;
  onBack: () => void;
  onSaveCustomer: (customer: Customer) => void;
}

export const AddCustomerScreen: React.FC<AddCustomerScreenProps> = ({
  onOpenMobileMenu,
  onBack,
  onSaveCustomer
}) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!contactNumber.trim()) {
      setError('Contact number is required.');
      return;
    }

    const newCustomer: Customer = {
      id: `CUST-${String(Math.floor(100 + Math.random() * 900))}`,
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      outstandingBalance: 0.0,
      creditLimit: 1000.0,
      address: address.trim() || undefined,
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    };

    onSaveCustomer(newCustomer);
  };

  return (
    <div id="add-customer-screen" className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] min-h-screen">
      {/* Navigation Header */}
      <header
        id="add-customer-header"
        className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5"
      >
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Mobile menu button for small screens */}
            <button
              id="add-customer-mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Left-aligned back arrow button (←) */}
            <button
              type="button"
              id="back-to-customers-btn"
              onClick={onBack}
              className="p-2 -ml-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Back to Customers list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Bold page title "Add New Customer" */}
            <div>
              <h1
                id="add-customer-page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Add New Customer
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Register a new customer account to track credit and store payments
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-4xl w-full mx-auto flex items-start justify-center">
        {/* Centered Form Card with elevated drop-shadow styling */}
        <div
          id="add-customer-card"
          className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-10 w-full max-w-2xl transition-all"
        >
          {error && (
            <div
              id="add-customer-error-alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-500 hover:text-red-800 text-xs font-semibold uppercase tracking-wider ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div>
              <label
                htmlFor="customer-name-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customer-name-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g., Juan Dela Cruz"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contact-number-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact-number-input"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder="09123456780"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs font-mono"
              />
            </div>

            {/* Address (multi-line textarea) */}
            <div>
              <label
                htmlFor="customer-address-textarea"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Address
              </label>
              <textarea
                id="customer-address-textarea"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs resize-y leading-relaxed"
              />
            </div>

            {/* Action Buttons (Bottom Right) */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              {/* Secondary Action: Gray outline button labeled "Cancel" */}
              <button
                type="button"
                id="cancel-add-customer-btn"
                onClick={onBack}
                className="py-2.5 px-5 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>

              {/* Primary Action: Solid orange/coral button labeled "Save Customer" */}
              <button
                type="submit"
                id="save-customer-submit-btn"
                className="py-2.5 px-6 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
