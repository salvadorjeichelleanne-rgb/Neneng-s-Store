import React, { useState } from 'react';
import { X, PlusCircle, User, CreditCard, Receipt, FileText } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CUSTOMER_NAMES } from '../data/transactions';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTxn: Transaction) => void;
  defaultCustomer?: string;
  defaultType?: TransactionType;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  defaultCustomer,
  defaultType = 'Utang'
}) => {
  const [customer, setCustomer] = useState(defaultCustomer || CUSTOMER_NAMES[1] || 'Juan Dela Cruz');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (defaultCustomer) {
      setCustomer(defaultCustomer);
    }
    if (defaultType) {
      setType(defaultType);
    }
  }, [defaultCustomer, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!customer) {
      setError('Please select a customer.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid transaction amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter an item summary or description.');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(
      today.getDate()
    ).padStart(2, '0')}/${today.getFullYear()}`;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer,
      customerId: `CUST-${Math.floor(10 + Math.random() * 90)}`,
      type,
      description: description.trim(),
      amount: numAmount,
      balance: type === 'Utang' ? numAmount + 150 : 0,
      status: type === 'Utang' ? 'Unpaid' : 'Paid',
      notes: notes.trim() || undefined
    };

    onAddTransaction(newTxn);
    onClose();
  };

  return (
    <div
      id="new-transaction-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="new-transaction-modal-card"
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#064e3b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-700/80 flex items-center justify-center text-emerald-100">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Record New Transaction</h3>
              <p className="text-xs text-emerald-200">Add credit (utang) or payment record</p>
            </div>
          </div>
          <button
            id="close-new-txn-modal-btn"
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

          {/* Transaction Type Radio Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="type-utang-btn"
                onClick={() => setType('Utang')}
                className={`py-2.5 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  type === 'Utang'
                    ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Utang (Credit)
              </button>
              <button
                type="button"
                id="type-payment-btn"
                onClick={() => setType('Payment')}
                className={`py-2.5 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  type === 'Payment'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Payment (Bayad)
              </button>
            </div>
          </div>

          {/* Customer */}
          <div>
            <label
              htmlFor="modal-customer-select"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Customer Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <select
                id="modal-customer-select"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                {CUSTOMER_NAMES.filter((c) => c !== 'All Customers').map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount (PHP) */}
          <div>
            <label
              htmlFor="modal-amount-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Amount (₱)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-gray-500">
                ₱
              </span>
              <input
                type="number"
                step="0.01"
                id="modal-amount-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="modal-desc-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Item Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="modal-desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === 'Utang' ? 'e.g., Noodles, Coffee' : 'e.g., Partial Payment, Cash'}
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
              id="save-new-transaction-btn"
              className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
