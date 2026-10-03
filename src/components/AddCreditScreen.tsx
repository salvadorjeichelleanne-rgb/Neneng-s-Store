import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Menu,
  Calendar,
  Search,
  UserPlus,
  Users,
  Check,
  X,
  User,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Calculator,
  ShoppingBag
} from 'lucide-react';
import { Customer, Transaction } from '../types';
import { TopbarUserStatus } from './TopbarUserStatus';

interface AddCreditScreenProps {
  customers: Customer[];
  defaultCustomerName?: string;
  onOpenMobileMenu?: () => void;
  onBack: () => void;
  onSaveTransaction: (transaction: Transaction) => void;
  onAddNewCustomer?: (newCustomer: Customer) => void;
  storeOwners?: string;
}

interface ItemRow {
  id: string;
  name: string;
  qty: string;
  price: string;
}

const SARI_SARI_PRESETS = [
  'Rice (1 kg)',
  'Canned Sardines',
  'Instant Noodles',
  'Coffee 3-in-1',
  'Eggs (1 pc)',
  'Cooking Oil'
];

export const AddCreditScreen: React.FC<AddCreditScreenProps> = ({
  customers,
  defaultCustomerName = '',
  onOpenMobileMenu,
  onBack,
  onSaveTransaction,
  onAddNewCustomer,
  storeOwners = 'Ederlyn & Roderick Salas'
}) => {
  const [customerMode, setCustomerMode] = useState<'old' | 'new'>('old');

  // Old customer selection state
  const [customerName, setCustomerName] = useState(defaultCustomerName || customers[0]?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // New customer input state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Transaction fields
  const [description, setDescription] = useState('');
  const [totalItems, setTotalItems] = useState('');
  const [amount, setAmount] = useState('');
  const todayISO = new Date().toISOString().split('T')[0];
  const [transactionDate, setTransactionDate] = useState(todayISO);
  const [error, setError] = useState('');

  // Itemized input with prices state
  const [itemsMode, setItemsMode] = useState<'itemized' | 'simple'>('itemized');
  const [itemRows, setItemRows] = useState<ItemRow[]>([
    { id: '1', name: '', qty: '1', price: '' }
  ]);

  // Recalculate total amount, total items, and description summary from item rows
  const syncTotalsFromItems = (rows: ItemRow[]) => {
    let sumAmount = 0;
    let sumQty = 0;
    const descParts: string[] = [];

    rows.forEach((row) => {
      const q = parseFloat(row.qty) || 0;
      const p = parseFloat(row.price) || 0;
      const lineTotal = q * p;
      if (q > 0 && p > 0) {
        sumAmount += lineTotal;
      }
      if (q > 0) {
        sumQty += q;
      }
      if (row.name.trim()) {
        const qtyPrefix = q > 1 ? `${q}x ` : '';
        const priceSuffix = p > 0 ? ` (₱${lineTotal.toFixed(2)})` : '';
        descParts.push(`${qtyPrefix}${row.name.trim()}${priceSuffix}`);
      }
    });

    if (sumAmount > 0) {
      setAmount(sumAmount.toFixed(2));
    }
    if (sumQty > 0) {
      setTotalItems(String(sumQty));
    }
    if (descParts.length > 0) {
      setDescription(descParts.join(', '));
    }
  };

  const handleAddItemRow = (presetName?: string) => {
    const newRow: ItemRow = {
      id: String(Date.now() + Math.random()),
      name: presetName || '',
      qty: '1',
      price: ''
    };
    const updated = [...itemRows, newRow];
    setItemRows(updated);
    if (presetName) {
      syncTotalsFromItems(updated);
    }
  };

  const handleUpdateItemRow = (id: string, field: keyof ItemRow, val: string) => {
    const updated = itemRows.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    setItemRows(updated);
    syncTotalsFromItems(updated);
    if (error) setError('');
  };

  const handleRemoveItemRow = (id: string) => {
    if (itemRows.length <= 1) {
      const resetRow: ItemRow[] = [{ id: String(Date.now()), name: '', qty: '1', price: '' }];
      setItemRows(resetRow);
      setAmount('');
      setTotalItems('');
      setDescription('');
      return;
    }
    const updated = itemRows.filter((r) => r.id !== id);
    setItemRows(updated);
    syncTotalsFromItems(updated);
  };

  // Close search suggestions on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter existing customers
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

  const activeCustomer = useMemo(() => {
    return customers.find(
      (c) => c.name.toLowerCase() === customerName.toLowerCase()
    );
  }, [customers, customerName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalCustomerName = '';
    let finalCustomerId = '';
    let currentBalance = 0;

    if (customerMode === 'old') {
      if (!customerName || customerName === '') {
        setError('Please select or search an existing customer.');
        return;
      }
      finalCustomerName = customerName;
      finalCustomerId = activeCustomer ? activeCustomer.id : 'CUST-001';
      currentBalance = activeCustomer ? activeCustomer.outstandingBalance : 0;
    } else {
      const trimmedName = newCustName.trim();
      if (!trimmedName) {
        setError('Please enter the customer name.');
        return;
      }

      const existingMatch = customers.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingMatch) {
        finalCustomerName = existingMatch.name;
        finalCustomerId = existingMatch.id;
        currentBalance = existingMatch.outstandingBalance;
      } else {
        const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
        const createdCustomer: Customer = {
          id: newId,
          name: trimmedName,
          contactNumber: newCustPhone.trim() || 'N/A',
          outstandingBalance: 0,
          creditLimit: 0,
          address: newCustAddress.trim() || 'Neighborhood Customer',
          joinedDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
        };

        if (onAddNewCustomer) {
          onAddNewCustomer(createdCustomer);
        }

        finalCustomerName = trimmedName;
        finalCustomerId = newId;
        currentBalance = 0;
      }
    }

    let finalDescription = description.trim();
    let finalItems: { name: string; qty: number; price: number }[] = [];

    if (itemsMode === 'itemized') {
      const validItems = itemRows
        .filter((r) => r.name.trim() !== '')
        .map((r) => ({
          name: r.name.trim(),
          qty: parseFloat(r.qty) || 1,
          price: parseFloat(r.price) || 0
        }));

      if (validItems.length === 0 && !finalDescription) {
        setError('Please enter at least one item name and its price.');
        return;
      }

      if (validItems.length > 0) {
        finalItems = validItems;
        if (!finalDescription) {
          finalDescription = validItems
            .map((it) => `${it.qty > 1 ? `${it.qty}x ` : ''}${it.name}${it.price > 0 ? ` (₱${(it.qty * it.price).toFixed(2)})` : ''}`)
            .join(', ');
        }
      }
    }

    if (!finalDescription) {
      setError('Please provide a description or items list.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid total amount.');
      return;
    }

    // Format date for display (MM/DD/YYYY)
    const [year, month, day] = transactionDate.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    const runningBalance = currentBalance + numAmount;

    const newTxn: Transaction = {
      id: `TXN-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: formattedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: finalCustomerName,
      customerId: finalCustomerId,
      type: 'Utang',
      amount: numAmount,
      balance: runningBalance,
      status: 'Unpaid',
      description: finalDescription,
      items: finalItems.length > 0 ? finalItems : undefined,
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
            <button
              id="add-credit-mobile-menu-btn"
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              id="back-btn"
              onClick={onBack}
              className="p-2 -ml-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1
                id="add-credit-page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight"
              >
                Add Utang / Record Credit
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Record a new credit transaction for Neneng's Store
              </p>
            </div>
          </div>

          {/* Right: Notification Bell and SO Profile Avatar */}
          <TopbarUserStatus storeOwners={storeOwners} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-4xl w-full mx-auto flex items-start justify-center">
        <div
          id="credit-form-card"
          className="bg-white rounded-2xl border border-gray-200/80 shadow-lg p-6 sm:p-10 w-full max-w-2xl transition-all"
        >
          {error && (
            <div
              id="add-credit-error-alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
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
            {/* Customer Mode Selection */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Customer Selection
                </label>
                <span className="text-xs text-gray-500 font-medium">
                  {customerMode === 'old' ? 'Existing Customer' : 'New Customer'}
                </span>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-lg">
                <button
                  type="button"
                  id="credit-screen-old-tab-btn"
                  onClick={() => {
                    setCustomerMode('old');
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    customerMode === 'old'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  Old Customer (Search / Find)
                </button>
                <button
                  type="button"
                  id="credit-screen-new-tab-btn"
                  onClick={() => {
                    setCustomerMode('new');
                    setError('');
                  }}
                  className={`py-2 px-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    customerMode === 'new'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-orange-600" />
                  New Customer (Input Name)
                </button>
              </div>

              {/* Old Customer Search / Select */}
              {customerMode === 'old' ? (
                <div className="space-y-3 pt-1">
                  {/* Search Autocomplete */}
                  <div ref={searchBoxRef} className="relative">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Search by Customer Name, Phone or Address
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        placeholder="Type to find existing suki..."
                        className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316]"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter suggestions */}
                    {isSearchOpen && (
                      <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg divide-y divide-gray-100">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-3 text-center text-xs text-gray-500">
                            No customers found for "{searchQuery}".
                            <button
                              type="button"
                              onClick={() => {
                                setNewCustName(searchQuery);
                                setCustomerMode('new');
                                setIsSearchOpen(false);
                              }}
                              className="block mx-auto mt-1 text-xs text-orange-600 font-semibold hover:underline"
                            >
                              + Add as New Customer
                            </button>
                          </div>
                        ) : (
                          filteredCustomers.map((cust) => (
                            <button
                              key={cust.id}
                              type="button"
                              onClick={() => {
                                setCustomerName(cust.name);
                                setSearchQuery('');
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 hover:bg-orange-50/60 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <div className="text-xs font-semibold text-gray-900">
                                {cust.name}{' '}
                                {cust.address && (
                                  <span className="text-[11px] text-gray-400 font-normal">
                                    ({cust.address})
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-gray-700">
                                ₱{cust.outstandingBalance.toFixed(2)}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dropdown select */}
                  <div>
                    <label
                      htmlFor="customer-name-select"
                      className="block text-xs font-medium text-gray-600 mb-1"
                    >
                      Or Choose from List
                    </label>
                    <select
                      id="customer-name-select"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors"
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
                  </div>

                  {/* Active Customer Details Pill */}
                  {activeCustomer && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-semibold text-emerald-950">
                            {activeCustomer.name}
                          </span>
                          <div className="text-[11px] text-emerald-800">
                            Current Utang: <b>₱{activeCustomer.outstandingBalance.toFixed(2)}</b>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md">
                        Selected Suki
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* New Customer Input Form */
                <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Register New Suki</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        This customer will be automatically saved to your store customer directory when you record this credit.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Customer Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={newCustName}
                        onChange={(e) => setNewCustName(e.target.value)}
                        placeholder="e.g., Aling Tessie Ramos"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={newCustPhone}
                          onChange={(e) => setNewCustPhone(e.target.value)}
                          placeholder="0917-123-4567"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Address / Purok (Optional)
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={newCustAddress}
                          onChange={(e) => setNewCustAddress(e.target.value)}
                          placeholder="e.g., Block 3 Lot 5, Purok 2"
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description / Items Section with Itemized Price Input */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Description / Items <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Input individual items with prices and quantities to automatically calculate the total
                  </p>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 bg-gray-200/70 p-1 rounded-xl self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    id="mode-itemized-btn"
                    onClick={() => setItemsMode('itemized')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      itemsMode === 'itemized'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Input with Prices
                  </button>
                  <button
                    type="button"
                    id="mode-simple-btn"
                    onClick={() => setItemsMode('simple')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      itemsMode === 'simple'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Quick Text
                  </button>
                </div>
              </div>

              {itemsMode === 'itemized' ? (
                <div className="bg-white border border-gray-300/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
                  {/* Table Headers for Desktop */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                    <div className="sm:col-span-5">Item Name / Description</div>
                    <div className="sm:col-span-2 text-center">Qty</div>
                    <div className="sm:col-span-3">Unit Price (₱)</div>
                    <div className="sm:col-span-2 text-right pr-6">Subtotal (₱)</div>
                  </div>

                  {/* Item Rows */}
                  <div className="space-y-3">
                    {itemRows.map((row, idx) => {
                      const q = parseFloat(row.qty) || 0;
                      const p = parseFloat(row.price) || 0;
                      const lineTotal = q * p;

                      return (
                        <div
                          key={row.id}
                          className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-3 items-stretch sm:items-center bg-gray-50/80 hover:bg-gray-50 p-3 rounded-xl border border-gray-200 transition-colors"
                        >
                          {/* Item Name */}
                          <div className="w-full sm:col-span-5">
                            <span className="sm:hidden text-xs font-bold text-gray-600 mb-1 block">
                              Item #{idx + 1}:
                            </span>
                            <div className="relative">
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => handleUpdateItemRow(row.id, 'name', e.target.value)}
                                placeholder="e.g., Rice 1kg, Lucky Me, Coffee..."
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                              />
                            </div>
                          </div>

                          {/* Qty & Price on Mobile side-by-side */}
                          <div className="grid grid-cols-2 sm:contents gap-2.5">
                            {/* Qty */}
                            <div className="sm:col-span-2">
                              <span className="sm:hidden text-xs font-medium text-gray-600 mb-1 block">
                                Qty:
                              </span>
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={row.qty}
                                onChange={(e) => handleUpdateItemRow(row.id, 'qty', e.target.value)}
                                placeholder="1"
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-center text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                              />
                            </div>

                            {/* Price */}
                            <div className="sm:col-span-3">
                              <span className="sm:hidden text-xs font-medium text-gray-600 mb-1 block">
                                Price (₱):
                              </span>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold pointer-events-none">
                                  ₱
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={row.price}
                                  onChange={(e) => handleUpdateItemRow(row.id, 'price', e.target.value)}
                                  placeholder="0.00"
                                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Line total & Delete */}
                          <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                            <div className="text-right">
                              <span className="sm:hidden text-xs text-gray-500 mr-1.5">Line Total:</span>
                              <span className="text-sm font-bold text-gray-900 font-mono">
                                ₱{lineTotal.toFixed(2)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(row.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete row"
                              aria-label="Delete item row"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Row Button & Sari-Sari Presets */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      id="add-item-row-btn"
                      onClick={() => handleAddItemRow()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] font-semibold text-xs border border-orange-200 transition-colors cursor-pointer self-start shadow-2xs"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Item
                    </button>

                    {/* Suki quick presets chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-gray-500 font-medium">Quick items:</span>
                      {SARI_SARI_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const lastRow = itemRows[itemRows.length - 1];
                            if (lastRow && !lastRow.name) {
                              handleUpdateItemRow(lastRow.id, 'name', preset);
                            } else {
                              handleAddItemRow(preset);
                            }
                          }}
                          className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer border border-gray-200 shadow-2xs"
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Simple text fallback */
                <textarea
                  id="description-items-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g., 2 kg rice, 1 canned sardines, 3 packs coffee..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs resize-y leading-relaxed"
                />
              )}
            </div>

            {/* Two-Column Row: Total Items & Total Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="total-items-input"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Total Items <span className="text-xs font-normal text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="total-items-input"
                  value={totalItems}
                  onChange={(e) => setTotalItems(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs font-mono"
                />
                {itemsMode === 'itemized' && totalItems && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3 text-emerald-600" /> Auto-summed from items above
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="total-amount-input"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-bold text-base">
                    ₱
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    id="total-amount-input"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs font-semibold font-mono"
                    required
                  />
                </div>
                {itemsMode === 'itemized' && amount && (
                  <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3 text-emerald-600" /> Auto-computed from item prices
                  </p>
                )}
              </div>
            </div>

            {/* Transaction Date Field */}
            <div>
              <label
                htmlFor="transaction-date-input"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="transaction-date-input"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#f97316] transition-colors shadow-2xs cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                id="cancel-credit-btn"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-credit-btn"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer text-center"
              >
                Save Credit Transaction
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
