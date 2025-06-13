import { useState } from 'react';

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

  const updateTotalPages = (totalItems: number) => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    updateTotalPages
  };
} 