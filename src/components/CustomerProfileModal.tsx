import React from 'react';
import { X, User, Phone, MapPin, CreditCard, Calendar, ShieldCheck } from 'lucide-react';
import { Customer } from '../types';

interface CustomerProfileModalProps {
  customer: Customer | null;
  onClose: () => void;
  onRecordTransaction?: (customerName: string) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  onClose,
  onRecordTransaction
}) => {
  if (!customer) return null;

  const initials = customer.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      id="customer-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="customer-profile-modal-card"
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#064e3b] text-white p-6 relative">
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-700 border-2 border-emerald-300/40 flex items-center justify-center font-bold text-lg text-white shadow-inner flex-shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-xl leading-tight text-white">{customer.name}</h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Active Customer • ID: {customer.id}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Balance card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Current Outstanding Balance</span>
              <span className={`text-2xl font-bold tracking-tight block mt-0.5 ${
                customer.outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-700'
              }`}>
                ₱{customer.outstandingBalance.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium block">Credit Limit</span>
              <span className="text-sm font-semibold text-gray-800 block mt-0.5">
                ₱{(customer.creditLimit || 1000).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Contact & Address Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Contact Number
              </span>
              <span className="font-medium text-gray-900">{customer.contactNumber}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Address
              </span>
              <span className="font-medium text-gray-900 text-right max-w-[200px] truncate">
                {customer.address || 'Barangay Central'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Registered Since
              </span>
              <span className="font-medium text-gray-900">{customer.joinedDate || 'Jan 2024'}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Credit Standing
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Good Standing
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {onRecordTransaction && (
              <button
                onClick={() => {
                  onClose();
                  onRecordTransaction(customer.name);
                }}
                className="flex-1 py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                New Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
