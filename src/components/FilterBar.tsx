import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { CUSTOMER_NAMES } from '../data/transactions';
import { FilterState } from '../types';

interface FilterBarProps {
  onApplyFilters: (filters: FilterState) => void;
  initialFilters: FilterState;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onApplyFilters,
  initialFilters,
  onReset
}) => {
  const [search, setSearch] = useState(initialFilters.search);
  const [date, setDate] = useState(initialFilters.date);
  const [type, setType] = useState(initialFilters.type);
  const [customer, setCustomer] = useState(initialFilters.customer);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyFilters({ search, date, type, customer });
  };

  const handleReset = () => {
    setSearch('');
    setDate('');
    setType('All');
    setCustomer('All Customers');
    onReset();
  };

  const isFiltered =
    search !== '' || date !== '' || type !== 'All' || customer !== 'All Customers';

  return (
    <div
      id="filter-search-container"
      className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4 sm:p-5 mb-6"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end"
      >
        {/* SEARCH Input */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          <label
            htmlFor="search-input"
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer or description..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* DATE Input */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="date-filter-input"
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase"
          >
            Date
          </label>
          <div className="relative">
            <input
              type="text"
              id="date-filter-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              className="w-full pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* TYPE Dropdown */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label
            htmlFor="type-select"
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase"
          >
            Type
          </label>
          <div className="relative">
            <select
              id="type-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Utang">Utang</option>
              <option value="Payment">Payment</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CUSTOMER Dropdown */}
        <div className="lg:col-span-2.5 sm:col-span-2 lg:col-span-3 flex flex-col gap-1.5">
          <label
            htmlFor="customer-select"
            className="text-xs font-semibold text-gray-700 tracking-wide uppercase"
          >
            Customer
          </label>
          <div className="relative">
            <select
              id="customer-select"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors cursor-pointer truncate"
            >
              {CUSTOMER_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* FILTER & Reset BUTTONS */}
        <div className="lg:col-span-1 flex items-center gap-2">
          <button
            type="submit"
            id="filter-button"
            className="w-full py-2.5 px-4 bg-[#f97316] hover:bg-[#ea580c] active:bg-[#c2410c] text-white font-medium text-sm rounded-lg shadow-xs transition-all duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          >
            Filter
          </button>

          {isFiltered && (
            <button
              type="button"
              id="filter-reset-button"
              onClick={handleReset}
              title="Reset Filters"
              className="p-2.5 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
