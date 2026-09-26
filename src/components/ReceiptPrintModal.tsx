import React from 'react';
import { X, Printer, Store } from 'lucide-react';
import { Transaction } from '../types';

interface ReceiptPrintModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-print-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="receipt-print-modal-content"
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-gray-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Header Bar */}
        <div className="bg-[#064e3b] text-white px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Store Transaction Voucher
          </span>
          <button
            id="close-receipt-modal-btn"
            onClick={onClose}
            className="text-emerald-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Slip Preview */}
        <div className="p-6 bg-[#fafafa] font-mono text-xs text-gray-800 space-y-4">
          <div className="text-center space-y-1 border-b border-dashed border-gray-300 pb-4">
            <div className="flex items-center justify-center gap-1.5 text-[#064e3b] font-bold text-base font-sans">
              <Store className="w-4 h-4" />
              Neneng's Store
            </div>
            <p className="text-[11px] text-gray-600 font-sans font-medium">Owners: Ederlyn Salas &amp; Roderick Salas</p>
            <p className="text-[10px] text-gray-400">Hours: 6:00 AM - 8:00 PM &bull; Tel: (02) 8123-4567 &bull; Manila, PH</p>
          </div>

          <div className="space-y-1.5 border-b border-dashed border-gray-300 pb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Ref:</span>
              <span className="font-bold">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{transaction.date} {transaction.time || '10:00 AM'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer:</span>
              <span className="font-bold">{transaction.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="font-bold uppercase">{transaction.type}</span>
            </div>
          </div>

          <div className="space-y-2 border-b border-dashed border-gray-300 pb-3">
            <div className="flex justify-between text-gray-500 text-[11px]">
              <span>DESCRIPTION</span>
              <span>AMOUNT</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="max-w-[180px]">{transaction.description}</span>
              <span>₱{transaction.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-sm font-bold">
              <span>Transaction Value:</span>
              <span>₱{transaction.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#064e3b]">
              <span>Remaining Balance:</span>
              <span>₱{transaction.balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 pt-1">
              <span>Status:</span>
              <span className="font-semibold uppercase text-gray-800">{transaction.status}</span>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-500 font-sans">
            <p>Maraming salamat sa inyong suki patronage!</p>
            <p className="mt-0.5 text-gray-400">Printed by Store Owners (Ederlyn &amp; Roderick Salas)</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            id="receipt-cancel-btn"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            id="receipt-print-confirm-btn"
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Slip
          </button>
        </div>
      </div>
    </div>
  );
};