import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TransactionTable } from './components/TransactionTable';
import { Pagination } from './components/Pagination';
import { TransactionModal } from './components/TransactionModal';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CustomersScreen } from './components/CustomersScreen';
import { AddCustomerScreen } from './components/AddCustomerScreen';
import { CustomerProfileScreen } from './components/CustomerProfileScreen';
import { AddCreditScreen } from './components/AddCreditScreen';
import { RecordPaymentScreen } from './components/RecordPaymentScreen';
import { NewTransactionModal } from './components/NewTransactionModal';
import { AddCustomerModal } from './components/AddCustomerModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { INITIAL_TRANSACTIONS } from './data/transactions';
import { INITIAL_CUSTOMERS } from './data/customers';
import { Transaction, Customer, FilterState, TransactionType } from './types';
import { Store, User, Clock, Check, Save, Menu } from 'lucide-react';
import { TopbarUserStatus } from './components/TopbarUserStatus';

export interface StoreInfo {
  storeName: string;
  storeOwners: string;
  operatingHours: string;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  storeName: "Neneng's Store",
  storeOwners: "Ederlyn Salas & Roderick Salas",
  operatingHours: "6:00 AM - 8:00 PM Daily"
};

export default function App() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    try {
      const saved = localStorage.getItem('neneng_store_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_STORE_INFO;
  });
  const [editingStoreInfo, setEditingStoreInfo] = useState<StoreInfo>(storeInfo);
  const [isStoreSavedNotice, setIsStoreSavedNotice] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(storeInfo.storeOwners);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [creditViewMode, setCreditViewMode] = useState<'add' | 'profile'>('profile');
  const [customerViewMode, setCustomerViewMode] = useState<'list' | 'add'>('list');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [receiptToPrint, setReceiptToPrint] = useState<Transaction | null>(null);
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isNewTxnModalOpen, setIsNewTxnModalOpen] = useState(false);
  const [newTxnCustomer, setNewTxnCustomer] = useState<string | undefined>(undefined);
  const [newTxnType, setNewTxnType] = useState<TransactionType>('Utang');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Restore defaults
  const handleRestoreDefaults = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCustomers(INITIAL_CUSTOMERS);
    setFilters({ search: '', date: '', type: 'All', customer: 'All' });
    setCurrentPage(1);
    setSelectedCustomerProfile(null);
    setActiveMenuItem('Dashboard');
    showToast('Restored all customer records and transaction data to defaults.');
  };

  // Filter state for Transaction History Screen
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    date: '',
    type: 'All',
    customer: 'All Customers'
  });

  // Filter transactions based on filter state
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesCustomer = t.customer.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        if (!matchesCustomer && !matchesDesc) return false;
      }

      // Date filter
      if (filters.date.trim()) {
        if (!t.date.includes(filters.date.trim())) return false;
      }

      // Type filter
      if (filters.type !== 'All' && t.type !== filters.type) {
        return false;
      }

      // Customer filter
      if (filters.customer !== 'All Customers' && t.customer !== filters.customer) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Paginated records for current page in Transaction History
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Filter handlers
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      date: '',
      type: 'All',
      customer: 'All Customers'
    });
    setCurrentPage(1);
  };

  // Toggle transaction status
  const handleToggleStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id === id) {
          const newStatus = txn.status === 'Paid' ? 'Unpaid' : 'Paid';
          showToast(`Transaction ${txn.id} marked as ${newStatus}`);
          return { ...txn, status: newStatus };
        }
        return txn;
      })
    );
  };

  const handleAddTransaction = (newTxn: Transaction) => {
    setTransactions((prev) => [newTxn, ...prev]);
    // Also update customer's outstanding balance
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.name.toLowerCase() === newTxn.customer.toLowerCase()) {
          const delta = newTxn.type === 'Utang' ? newTxn.amount : -newTxn.amount;
          const updatedBalance = Math.max(0, c.outstandingBalance + delta);
          const updatedCustomer = { ...c, outstandingBalance: updatedBalance };
          if (selectedCustomerProfile && selectedCustomerProfile.id === c.id) {
            setSelectedCustomerProfile(updatedCustomer);
          }
          return updatedCustomer;
        }
        return c;
      })
    );
    showToast(`Transaction recorded for ${newTxn.customer} (₱${newTxn.amount.toFixed(2)})`);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Customer ${newCustomer.name} added successfully`);
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedCustomerProfile && selectedCustomerProfile.id === updated.id) {
      setSelectedCustomerProfile(updated);
    }
    showToast(`Customer ${updated.name} updated successfully`);
  };

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreInfo.storeName.trim()) {
      showToast('Store name cannot be empty.');
      return;
    }
    if (!editingStoreInfo.storeOwners.trim()) {
      showToast('Store owners cannot be empty.');
      return;
    }
    if (!editingStoreInfo.operatingHours.trim()) {
      showToast('Operating hours cannot be empty.');
      return;
    }

    setStoreInfo(editingStoreInfo);
    setCurrentUser(editingStoreInfo.storeOwners);
    try {
      localStorage.setItem('neneng_store_profile', JSON.stringify(editingStoreInfo));
    } catch (err) {
      console.error(err);
    }
    setIsStoreSavedNotice(true);
    setTimeout(() => setIsStoreSavedNotice(false), 3000);
    showToast('Store Information updated successfully!');
  };

  const handleResetStoreInfo = () => {
    setEditingStoreInfo(storeInfo);
  };

  const showToast = (message: string) => {
    setStatusNotification(message);
    setTimeout(() => {
      setStatusNotification(null);
    }, 3000);
  };

  const handleLoginSuccess = (user: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveMenuItem('Dashboard');
    showToast(`Welcome back, ${storeInfo.storeOwners}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSidebarItemSelect = (item: string) => {
    if (item === 'Logout') {
      handleLogout();
    } else {
      setActiveMenuItem(item);
      if (item === 'Credit / Utang') {
        setCreditViewMode('add');
      }
      if (item === 'Customers') {
        setCustomerViewMode('list');
      }
    }
  };

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app-root" className="min-h-screen bg-[#f8f9fa] text-gray-900 flex">
      {/* Fixed Vertical Navigation Bar in deep emerald green */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeItem={activeMenuItem}
        onSelectItem={handleSidebarItemSelect}
        storeName={storeInfo.storeName}
        storeOwners={storeInfo.storeOwners}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Status Notification Toast */}
        {statusNotification && (
          <div
            id="status-toast"
            className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {statusNotification}
          </div>
        )}

        {/* View Switcher based on Active Menu Item */}
        {activeMenuItem === 'Credit / Utang' ? (
          creditViewMode === 'add' ? (
            <AddCreditScreen
              customers={customers}
              defaultCustomerName={newTxnCustomer || selectedCustomerProfile?.name || 'Juan Dela Cruz'}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onBack={() => setCreditViewMode('profile')}
              onSaveTransaction={(newTxn) => {
                handleAddTransaction(newTxn);
                setCreditViewMode('profile');
              }}
              onAddNewCustomer={handleAddCustomer}
              storeOwners={storeInfo.storeOwners}
            />
          ) : (
            <CustomerProfileScreen
              customer={selectedCustomerProfile || customers[0]}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onBackToCustomers={() => {
                setActiveMenuItem('Customers');
                setCustomerViewMode('list');
              }}
              onOpenUtang={(name) => {
                setNewTxnCustomer(name);
                setCreditViewMode('add');
              }}
              onOpenPayment={(name) => {
                setNewTxnCustomer(name);
                setActiveMenuItem('Payments');
              }}
              onUpdateCustomer={handleUpdateCustomer}
              storeOwners={storeInfo.storeOwners}
            />
          )
        ) : activeMenuItem === 'Payments' ? (
          <RecordPaymentScreen
            customers={customers}
            defaultCustomerName={newTxnCustomer || selectedCustomerProfile?.name || 'Juan Dela Cruz'}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onSavePayment={(newTxn) => {
              handleAddTransaction(newTxn);
              setActiveMenuItem('Credit / Utang');
              setCreditViewMode('profile');
            }}
            onCancel={() => {
              setActiveMenuItem('Credit / Utang');
              setCreditViewMode('profile');
            }}
            storeOwners={storeInfo.storeOwners}
          />
        ) : activeMenuItem === 'Customers' ? (
          customerViewMode === 'add' ? (
            <AddCustomerScreen
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              onBack={() => setCustomerViewMode('list')}
              onSaveCustomer={(newCust) => {
                handleAddCustomer(newCust);
                setCustomerViewMode('list');
              }}
              storeOwners={storeInfo.storeOwners}
            />
          ) : (
            <CustomersScreen
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              customers={customers}
              onOpenAddCustomer={() => setCustomerViewMode('add')}
              onViewCustomerProfile={(cust) => {
                setSelectedCustomerProfile(cust);
                setActiveMenuItem('Credit / Utang');
                setCreditViewMode('profile');
              }}
              onRecordTransactionForCustomer={(name) => {
                setNewTxnCustomer(name);
                setActiveMenuItem('Credit / Utang');
                setCreditViewMode('add');
              }}
              storeOwners={storeInfo.storeOwners}
            />
          )
        ) : activeMenuItem === 'Dashboard' ? (
          <DashboardScreen
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenNewTransaction={() => {
              setNewTxnCustomer(undefined);
              setIsNewTxnModalOpen(true);
            }}
            onViewAllTransactions={() => setActiveMenuItem('Transaction History')}
            recentTransactions={transactions}
            onViewDetails={(txn) => setSelectedTransaction(txn)}
            onPrintTransaction={(txn) => setReceiptToPrint(txn)}
            onToggleStatus={handleToggleStatus}
            storeName={storeInfo.storeName}
            storeOwners={storeInfo.storeOwners}
            operatingHours={storeInfo.operatingHours}
          />
        ) : activeMenuItem === 'Transaction History' ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header Bar */}
            <Header
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              storeOwners={storeInfo.storeOwners}
            />

            {/* Page Main Content */}
            <main
              id="main-content"
              className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto"
            >
              {/* Multi-input Search and Filter Bar */}
              <FilterBar
                initialFilters={filters}
                onApplyFilters={handleApplyFilters}
                onReset={handleResetFilters}
              />

              {/* Transaction Data Table */}
              <TransactionTable
                transactions={paginatedTransactions}
                onViewDetails={(txn) => setSelectedTransaction(txn)}
                onToggleStatus={handleToggleStatus}
                onPrintTransaction={(txn) => setReceiptToPrint(txn)}
              />

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredTransactions.length}
                pageSize={pageSize}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </main>
          </div>
        ) : activeMenuItem === 'Settings' ? (
          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5">
              <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <button
                    id="settings-mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Settings &amp; Preferences</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage store profile, owners, and operating hours</p>
                  </div>
                </div>
                <TopbarUserStatus storeOwners={storeInfo.storeOwners} />
              </div>
            </header>
            <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Store Information</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Edit your store details, owners, and operating hours across the application
                    </p>
                  </div>
                  {isStoreSavedNotice && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full animate-in fade-in duration-150">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Changes Saved!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveStoreInfo} className="space-y-5">
                  {/* Store Name */}
                  <div>
                    <label
                      htmlFor="setting-store-name"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Store className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="setting-store-name"
                        value={editingStoreInfo.storeName}
                        onChange={(e) =>
                          setEditingStoreInfo((prev) => ({ ...prev, storeName: e.target.value }))
                        }
                        placeholder="e.g., Neneng's Store"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-colors"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Appears on the sidebar, header, printable receipts, and vouchers.
                    </p>
                  </div>

                  {/* Store Owners */}
                  <div>
                    <label
                      htmlFor="setting-store-owners"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Store Owners <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="setting-store-owners"
                        value={editingStoreInfo.storeOwners}
                        onChange={(e) =>
                          setEditingStoreInfo((prev) => ({ ...prev, storeOwners: e.target.value }))
                        }
                        placeholder="e.g., Ederlyn Salas & Roderick Salas"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-colors"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Displayed on the dashboard header, owner profile badge, and receipt slips.
                    </p>
                  </div>

                  {/* Operating Hours */}
                  <div>
                    <label
                      htmlFor="setting-operating-hours"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                    >
                      Operating Hours <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="setting-operating-hours"
                        value={editingStoreInfo.operatingHours}
                        onChange={(e) =>
                          setEditingStoreInfo((prev) => ({
                            ...prev,
                            operatingHours: e.target.value
                          }))
                        }
                        placeholder="e.g., 6:00 AM - 8:00 PM Daily"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-colors"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Displayed in the dashboard status badge and receipts.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      id="reset-store-info-btn"
                      onClick={handleResetStoreInfo}
                      className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="submit"
                      id="save-store-info-btn"
                      className="w-full sm:w-auto px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        ) : (
          /* Fallback for other views such as Reports */
          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5">
              <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <button
                    id="reports-mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden focus:outline-none cursor-pointer"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{activeMenuItem}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{storeInfo.storeName} Management Module ({storeInfo.storeOwners})</p>
                  </div>
                </div>
                <TopbarUserStatus storeOwners={storeInfo.storeOwners} />
              </div>
            </header>
            <main className="flex-1 px-4 sm:px-8 py-10 max-w-7xl w-full mx-auto text-center">
              <div className="bg-white rounded-xl border border-gray-200 p-12 max-w-md mx-auto shadow-xs space-y-3">
                <h2 className="text-lg font-bold text-gray-900">{activeMenuItem} Module</h2>
                <p className="text-sm text-gray-500">
                  You are currently viewing the {activeMenuItem} view. Use the sidebar to switch back to the Dashboard or Transaction History anytime.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveMenuItem('Dashboard')}
                    className="px-4 py-2 bg-[#064e3b] text-white text-xs font-semibold rounded-lg"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => setActiveMenuItem('Transaction History')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                  >
                    View Transactions
                  </button>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTxnModalOpen}
        onClose={() => {
          setIsNewTxnModalOpen(false);
          setNewTxnCustomer(undefined);
          setNewTxnType('Utang');
        }}
        onAddTransaction={handleAddTransaction}
        customers={customers}
        onAddNewCustomer={handleAddCustomer}
        defaultCustomer={newTxnCustomer}
        defaultType={newTxnType}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      {/* Customer Profile Details Modal */}
      <CustomerProfileModal
        customer={selectedCustomerProfile}
        onClose={() => setSelectedCustomerProfile(null)}
        onRecordTransaction={(customerName) => {
          setNewTxnCustomer(customerName);
          setIsNewTxnModalOpen(true);
        }}
      />

      {/* Transaction Details Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onPrint={(txn) => {
          setSelectedTransaction(null);
          setReceiptToPrint(txn);
        }}
      />

      {/* Receipt Voucher Print Slip Modal */}
      <ReceiptPrintModal
        transaction={receiptToPrint}
        onClose={() => setReceiptToPrint(null)}
        storeName={storeInfo.storeName}
        storeOwners={storeInfo.storeOwners}
        operatingHours={storeInfo.operatingHours}
      />
    </div>
  );
}
