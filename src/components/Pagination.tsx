import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Default pages range: display pages 1, 2, 3, 4, 5 (as requested in prompt)
  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div
      id="pagination-container"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8"
    >
      {/* Left Text */}
      <div id="pagination-info" className="text-xs sm:text-sm text-gray-500">
        Showing{' '}
        <span className="font-medium text-gray-700">{startItem}</span> to{' '}
        <span className="font-medium text-gray-700">{endItem}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span> transactions
      </div>

      {/* Right Controls: Numbered pagination buttons */}
      <div id="pagination-controls" className="flex items-center gap-1.5">
        {/* Previous page button */}
        <button
          id="pagination-prev-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered pagination buttons */}
        {pageNumbers.map((num) => {
          const isActive = num === currentPage;
          return (
            <button
              key={num}
              id={`pagination-page-${num}-btn`}
              onClick={() => onPageChange(num)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? 'bg-[#f97316] text-white shadow-xs font-semibold hover:bg-[#ea580c]'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {num}
            </button>
          );
        })}

        {/* If more than 5 pages, optionally show ... and last page */}
        {totalPages > 5 && (
          <>
            <span className="text-gray-400 px-1 text-sm">...</span>
            <button
              id={`pagination-page-${totalPages}-btn`}
              onClick={() => onPageChange(totalPages)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                ${
                  totalPages === currentPage
                    ? 'bg-[#f97316] text-white shadow-xs font-semibold hover:bg-[#ea580c]'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next page button */}
        <button
          id="pagination-next-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
