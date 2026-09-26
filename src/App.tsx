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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('Ederlyn & Roderick Salas');
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
    showToast(`Welcome back, Ederlyn & Roderick Salas!`);
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
          />
        ) : activeMenuItem === 'Transaction History' ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header Bar */}
            <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

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
              <h1 className="text-2xl font-bold text-gray-900">Settings &amp; Preferences</h1>
              <p className="text-sm text-gray-500">Manage store preferences and application data</p>
            </header>
            <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Store Information</h2>
                <p className="text-xs text-gray-500 mb-4">Current operating profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 block">Store Name</span>
                    <span className="font-semibold text-gray-900">Salas Sari-Sari Store</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 block">Store Owners</span>
                    <span className="font-semibold text-gray-900">Ederlyn Salas &amp; Roderick Salas</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 block">Currency</span>
                    <span className="font-semibold text-gray-900">Philippine Peso (₱)</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 block">Operating Hours</span>
                    <span className="font-semibold text-gray-900">6:00 AM - 8:00 PM Daily</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Data Management &amp; Restore</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Reset application records to the original starter ledger and customer accounts.
                </p>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm mb-4">
                  <p className="font-semibold">Restore Initial Demo Data</p>
                  <p className="text-xs mt-1 text-amber-800">
                    Restoring defaults will reset all customers' balances, reinstate sample transactions, and clear active filters.
                  </p>
                </div>
                <button
                  type="button"
                  id="restore-demo-data-btn"
                  onClick={handleRestoreDefaults}
                  className="px-5 py-2.5 bg-[#064e3b] hover:bg-[#043d2e] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Restore Initial Demo Data
                </button>
              </div>
            </main>
          </div>
        ) : (
          /* Fallback for other views */
          <div className="flex-1 flex flex-col min-w-0">
            <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-5">
              <h1 className="text-2xl font-bold text-gray-900">{activeMenuItem}</h1>
              <p className="text-sm text-gray-500">Salas Store Credit Management Module (Ederlyn &amp; Roderick Salas)</p>
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
      />
    </div>
  );
}
