import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  PlusCircle,
  User,
  CreditCard,
  Receipt,
  FileText,
  Search,
  UserPlus,
  Users,
  Check,
  ChevronDown,
  Phone,
  MapPin,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Transaction, TransactionType, Customer } from '../types';
import { INITIAL_CUSTOMERS } from '../data/customers';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTxn: Transaction) => void;
  customers?: Customer[];
  onAddNewCustomer?: (newCustomer: Customer) => void;
  defaultCustomer?: string;
  defaultType?: TransactionType;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  customers = INITIAL_CUSTOMERS,
  onAddNewCustomer,
  defaultCustomer,
  defaultType = 'Utang'
}) => {
  // Customer mode: 'old' (search existing suki) or 'new' (input new customer name)
  const [customerMode, setCustomerMode] = useState<'old' | 'new'>('old');

  // Old customer selection & search state
  const [selectedCustomerName, setSelectedCustomerName] = useState(
    defaultCustomer || customers[0]?.name || 'Juan Dela Cruz'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // New customer inputs
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerContact, setNewCustomerContact] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Common transaction fields
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Synchronize defaults on open
  useEffect(() => {
    if (defaultCustomer) {
      setSelectedCustomerName(defaultCustomer);
      setCustomerMode('old');
    }
    if (defaultType) {
      setType(defaultType);
    }
    if (isOpen) {
      setError('');
    }
  }, [defaultCustomer, defaultType, isOpen]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter existing customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.contactNumber && c.contactNumber.includes(query)) ||
        (c.address && c.address.toLowerCase().includes(query))
    );
  }, [customers, searchQuery]);

  // Selected existing customer object
  const activeCustomerObj = useMemo(() => {
    return customers.find(
      (c) => c.name.toLowerCase() === selectedCustomerName.toLowerCase()
    );
  }, [customers, selectedCustomerName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalCustomerName = '';
    let finalCustomerId = '';
    let currentBalance = 0;

    if (customerMode === 'old') {
      if (!selectedCustomerName) {
        setError('Please select or search an existing customer.');
        return;
      }
      finalCustomerName = selectedCustomerName;
      finalCustomerId = activeCustomerObj ? activeCustomerObj.id : `CUST-${Math.floor(100 + Math.random() * 900)}`;
      currentBalance = activeCustomerObj ? activeCustomerObj.outstandingBalance : 0;
    } else {
      // New Customer Mode
      const trimmedName = newCustomerName.trim();
      if (!trimmedName) {
        setError('Please enter the new customer name.');
        return;
      }

      // Check if customer already exists
      const existingMatch = customers.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (existingMatch) {
        finalCustomerName = existingMatch.name;
        finalCustomerId = existingMatch.id;
        currentBalance = existingMatch.outstandingBalance;
      } else {
        const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
        const newCustomer: Customer = {
          id: newId,
          name: trimmedName,
          contactNumber: newCustomerContact.trim() || 'N/A',
          outstandingBalance: 0,
          creditLimit: 0,
          address: newCustomerAddress.trim() || 'Purok Resident',
          joinedDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
        };

        if (onAddNewCustomer) {
          onAddNewCustomer(newCustomer);
        }

        finalCustomerName = trimmedName;
        finalCustomerId = newId;
        currentBalance = 0;
      }
    }

    const numAmount = parseFloat(amount);
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

    const newBalance =
      type === 'Utang'
        ? currentBalance + numAmount
        : Math.max(0, currentBalance - numAmount);

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: finalCustomerName,
      customerId: finalCustomerId,
      type,
      description: description.trim(),
      amount: numAmount,
      balance: newBalance,
      status: type === 'Utang' ? 'Unpaid' : 'Paid',
      notes: notes.trim() || undefined
    };

    onAddTransaction(newTxn);
    onClose();

    // Reset inputs
    setNewCustomerName('');
    setNewCustomerContact('');
    setNewCustomerAddress('');
    setAmount('');
    setDescription('');
    setNotes('');
    setSearchQuery('');
  };

  return (
    <div
      id="new-transaction-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="new-transaction-modal-card"
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 my-8"
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
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
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'Utang'
                    ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20 shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-red-600" />
                Utang (Credit)
              </button>
              <button
                type="button"
                id="type-payment-btn"
                onClick={() => setType('Payment')}
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'Payment'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Receipt className="w-4 h-4 text-emerald-700" />
                Payment (Bayad)
              </button>
            </div>
          </div>

          {/* Customer Type Selector: Old vs New Customer */}
          <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-500" />
                Customer Type
              </label>
              <span className="text-[11px] text-gray-500">
                {customerMode === 'old' ? 'Existing Suki' : 'New Registration'}
              </span>
            </div>

            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-lg">
              <button
                type="button"
                id="old-customer-tab-btn"
                onClick={() => {
                  setCustomerMode('old');
                  setError('');
                }}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  customerMode === 'old'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                Old Customer (Find / Search)
              </button>
              <button
                type="button"
                id="new-customer-tab-btn"
                onClick={() => {
                  setCustomerMode('new');
                  setError('');
                }}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  customerMode === 'new'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-orange-600" />
                New Customer (Input Name)
              </button>
            </div>

            {/* OLD CUSTOMER SEARCH & SELECT SECTION */}
            {customerMode === 'old' ? (
              <div className="space-y-2.5 pt-1">
                {/* Search Bar with Autocomplete Dropdown */}
                <div ref={searchContainerRef} className="relative">
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Find / Search Suki Name
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="search-customer-input"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchDropdownOpen(true);
                      }}
                      onFocus={() => setIsSearchDropdownOpen(true)}
                      placeholder="Type name, phone, or address to search..."
                      className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setIsSearchDropdownOpen(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search Autocomplete Suggestions */}
                  {isSearchDropdownOpen && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg divide-y divide-gray-100">
                      {filteredCustomers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-gray-500">
                          No existing customer found matching "{searchQuery}".
                          <button
                            type="button"
                            onClick={() => {
                              setNewCustomerName(searchQuery);
                              setCustomerMode('new');
                              setIsSearchDropdownOpen(false);
                            }}
                            className="block mx-auto mt-1.5 text-xs text-orange-600 font-semibold hover:underline"
                          >
                            + Add as New Customer
                          </button>
                        </div>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const isSelected = cust.name === selectedCustomerName;
                          return (
                            <button
                              key={cust.id}
                              type="button"
                              onClick={() => {
                                setSelectedCustomerName(cust.name);
                                setSearchQuery('');
                                setIsSearchDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/60 transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected ? 'bg-emerald-50 text-emerald-950 font-medium' : 'text-gray-800'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                                  {cust.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold flex items-center gap-1.5">
                                    <span>{cust.name}</span>
                                    {cust.address && (
                                      <span className="text-[10px] text-gray-400 font-normal">
                                        ({cust.address})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    Tel: {cust.contactNumber || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-bold text-gray-900">
                                  ₱{cust.outstandingBalance.toFixed(2)}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Dropdown Fallback */}
                <div>
                  <label htmlFor="modal-customer-select" className="text-xs font-medium text-gray-600 block mb-1">
                    Or Select from Customer List
                  </label>
                  <select
                    id="modal-customer-select"
                    value={selectedCustomerName}
                    onChange={(e) => setSelectedCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} &bull; Outstanding: ₱{c.outstandingBalance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Customer Status Card */}
                {activeCustomerObj && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-emerald-950">
                          {activeCustomerObj.name}
                        </span>
                        <div className="text-[11px] text-emerald-800">
                          Current Utang: <b>₱{activeCustomerObj.outstandingBalance.toFixed(2)}</b>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md">
                      Active Suki
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* NEW CUSTOMER INPUT SECTION */
              <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">New Customer Registration</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Enter the customer's name below. They will be automatically saved to your store customer directory.
                    </p>
                  </div>
                </div>

                {/* New Customer Full Name */}
                <div>
                  <label htmlFor="new-customer-name-input" className="text-xs font-semibold text-gray-700 block mb-1">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="new-customer-name-input"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="e.g., Aling Tessie Ramos"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number and Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="new-customer-phone-input" className="text-xs font-medium text-gray-600 block mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="new-customer-phone-input"
                        value={newCustomerContact}
                        onChange={(e) => setNewCustomerContact(e.target.value)}
                        placeholder="0917-123-4567"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-customer-addr-input" className="text-xs font-medium text-gray-600 block mb-1">
                      Address / Purok (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="new-customer-addr-input"
                        value={newCustomerAddress}
                        onChange={(e) => setNewCustomerAddress(e.target.value)}
                        placeholder="e.g., Block 3 Lot 5, Purok 2"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amount (PHP) */}
          <div>
            <label
              htmlFor="modal-amount-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Amount (₱) <span className="text-red-500">*</span>
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
                className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Item Description */}
          <div>
            <label
              htmlFor="modal-desc-input"
              className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-1.5"
            >
              Item Description <span className="text-red-500">*</span>
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
                placeholder={type === 'Utang' ? 'e.g., 2 Canned Sardines, 1kg Rice, Coffee' : 'e.g., Cash Payment, Partial Bayad'}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                required
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label
              htmlFor="modal-notes-input"
              className="text-xs font-medium text-gray-600 block mb-1"
            >
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              id="modal-notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Promised to pay on Friday"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-new-transaction-btn"
              className="px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Save Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
