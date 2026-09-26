import React, { useState } from 'react';
import { X, UserPlus, User, Phone, MapPin, DollarSign } from 'lucide-react';
import { Customer } from '../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (newCustomer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer
}) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [creditLimit, setCreditLimit] = useState('1000.00');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

    const parsedLimit = parseFloat(creditLimit) || 1000;

    const newCustomer: Customer = {
      id: `CUST-${String(Math.floor(100 + Math.random() * 900))}`,
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      outstandingBalance: 0.0,
      creditLimit: parsedLimit,
      address: address.trim() || 'Barangay Central',
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    };

    onAddCustomer(newCustomer);
    setName('');
    setContactNumber('');
    setCreditLimit('1000.00');
    setAddress('');
    setError('');
    onClose();
  };

  return (
    <div
      id="add-customer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="add-customer-modal-card"
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#064e3b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-700/80 flex items-center justify-center text-emerald-100">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Add New Customer</h3>
              <p className="text-xs text-emerald-200">Register a customer for credit recording</p>
            </div>
          </div>
          <button
            id="close-add-customer-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="customer-fullname-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Customer Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="customer-fullname-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Juan Dela Cruz"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label
              htmlFor="customer-phone-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Contact Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="customer-phone-input"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 09123456780"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Credit Limit */}
          <div>
            <label
              htmlFor="customer-credit-limit-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Credit Limit (₱)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="50"
                id="customer-credit-limit-input"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="1000.00"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="customer-address-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Address / Purok (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="customer-address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Block 4 Lot 12, Dahlia St."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-customer-btn"
              className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
