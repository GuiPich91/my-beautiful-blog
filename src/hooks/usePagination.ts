import { useState } from 'react';
import { PaginationParams } from '@/types';

interface UsePaginationProps {
  initialPage?: number;
  itemsPerPage?: number;
}

export function usePagination({ initialPage = 1, itemsPerPage = 10 }: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateTotalPages = (total: number) => {
    setTotalPages(Math.ceil(total / itemsPerPage));
  };

  return {
    currentPage,
    totalPages,
    handlePageChange,
    updateTotalPages,
    paginationParams: {
      page: currentPage,
      limit: itemsPerPage
    } as PaginationParams
  };
} 