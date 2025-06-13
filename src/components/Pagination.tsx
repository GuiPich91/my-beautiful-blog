interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
  page: number;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>
      
      <span>
        Page {page} sur {totalPages}
      </span>
      
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
} 