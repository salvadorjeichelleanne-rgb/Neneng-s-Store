import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Printer, CheckCircle, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
  onToggleStatus: (id: string) => void;
  onPrintTransaction: (transaction: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onViewDetails,
  onToggleStatus,
  onPrintTransaction
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close action dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      id="transaction-table-container"
      className="bg-white rounded-xl shadow-xs border border-gray-200/90 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table id="transactions-data-table" className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700">
                DATE
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700">
                CUSTOMER
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700">
                TYPE
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700">
                DESCRIPTION
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700 text-right">
                AMOUNT
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700 text-right">
                BALANCE
              </th>
              <th scope="col" className="py-3.5 px-5 font-semibold text-gray-700 text-center">
                STATUS
              </th>
              <th scope="col" className="py-3.5 px-4 font-semibold text-gray-700 text-center w-14">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200/80 text-sm text-gray-800">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="font-medium text-gray-600">No transactions found</p>
                    <p className="text-xs text-gray-400">Try adjusting your search or filter options</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => {
                const isMenuOpen = activeMenuId === txn.id;

                return (
                  <tr
                    key={txn.id}
                    id={`transaction-row-${txn.id.toLowerCase()}`}
                    onClick={() => onViewDetails(txn)}
                    className="hover:bg-gray-50/80 transition-colors duration-100 cursor-pointer group"
                  >
                    {/* DATE */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-600">
                      {txn.date}
                    </td>

                    {/* CUSTOMER */}
                    <td className="py-4 px-5 whitespace-nowrap font-medium text-gray-900">
                      {txn.customer}
                    </td>

                    {/* TYPE Badge Indicator */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {txn.type === 'Utang' ? (
                        <span
                          id={`type-badge-utang-${txn.id.toLowerCase()}`}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                        >
                          Utang
                        </span>
                      ) : (
                        <span
                          id={`type-badge-payment-${txn.id.toLowerCase()}`}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          Payment
                        </span>
                      )}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="py-4 px-5 text-gray-700 max-w-xs truncate" title={txn.description}>
                      {txn.description}
                    </td>

                    {/* AMOUNT */}
                    <td className="py-4 px-5 whitespace-nowrap text-right font-semibold text-gray-900">
                      ₱{txn.amount.toFixed(2)}
                    </td>

                    {/* BALANCE */}
                    <td className="py-4 px-5 whitespace-nowrap text-right font-medium text-gray-700">
                      ₱{txn.balance.toFixed(2)}
                    </td>

                    {/* STATUS Pill Status Tags */}
                    <td className="py-4 px-5 whitespace-nowrap text-center">
                      {txn.status === 'Paid' ? (
                        <span
                          id={`status-pill-paid-${txn.id.toLowerCase()}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          Paid
                        </span>
                      ) : (
                        <span
                          id={`status-pill-unpaid-${txn.id.toLowerCase()}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"
                        >
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* ACTION Vertical 3-dot Button */}
                    <td className="py-4 px-4 whitespace-nowrap text-center relative">
                      <div className="relative inline-block text-left" ref={isMenuOpen ? menuRef : null}>
                        <button
                          type="button"
                          id={`action-menu-btn-${txn.id.toLowerCase()}`}
                          onClick={(e) => toggleMenu(txn.id, e)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                          aria-label={`Actions for transaction ${txn.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Action Menu Dropdown */}
                        {isMenuOpen && (
                          <div
                            id={`action-dropdown-${txn.id.toLowerCase()}`}
                            className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              id={`action-view-details-${txn.id.toLowerCase()}`}
                              onClick={() => {
                                onViewDetails(txn);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              View Details
                            </button>

                            <button
                              id={`action-print-${txn.id.toLowerCase()}`}
                              onClick={() => {
                                onPrintTransaction(txn);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                              <Printer className="w-3.5 h-3.5 text-gray-400" />
                              Print Receipt
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                              id={`action-toggle-status-${txn.id.toLowerCase()}`}
                              onClick={() => {
                                onToggleStatus(txn.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                              {txn.status === 'Paid' ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                  Mark as Unpaid
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  Mark as Paid
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
