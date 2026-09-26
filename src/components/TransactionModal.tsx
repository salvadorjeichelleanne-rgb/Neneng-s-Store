import React from 'react';
import { X, Receipt, Calendar, User, Tag, CheckCircle2, Clock, Printer } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onPrint?: (t: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onPrint
}) => {
  if (!transaction) return null;

  return (
    <div
      id="transaction-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="transaction-detail-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#064e3b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Transaction Details</h3>
              <p className="text-xs text-emerald-200">Ref ID: {transaction.id}</p>
            </div>
          </div>
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Key Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                Transaction Value
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                ₱{transaction.amount.toFixed(2)}
              </span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                Updated Balance
              </span>
              <span className="text-xl font-bold text-emerald-800 mt-1 block">
                ₱{transaction.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" /> Customer
              </span>
              <span className="font-semibold text-gray-900">{transaction.customer}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> Date & Time
              </span>
              <span className="font-medium text-gray-800">
                {transaction.date} {transaction.time ? `• ${transaction.time}` : ''}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-gray-400" /> Transaction Type
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                  transaction.type === 'Utang'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gray-400" /> Status
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="py-2 border-b border-gray-100">
              <span className="text-gray-500 block mb-1">Description</span>
              <p className="text-gray-800 font-medium bg-gray-50 p-2.5 rounded-lg text-xs">
                {transaction.description}
                {transaction.notes ? ` — ${transaction.notes}` : ''}
              </p>
            </div>

            {/* Itemized list if available */}
            {transaction.items && transaction.items.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-600 block mb-2 uppercase tracking-wide">
                  Itemized Breakdown
                </span>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  {transaction.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-700">
                      <span>
                        {it.name} (x{it.qty})
                      </span>
                      <span className="font-semibold text-gray-900">₱{it.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            id="print-detail-btn"
            onClick={() => {
              if (onPrint) onPrint(transaction);
              else window.print();
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            id="close-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-[#064e3b] hover:bg-[#054031] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
