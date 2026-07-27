"use client";

export default function Pagination({
  currentPage,
  totalItems,
  entries,
  onPageChange,
}) {
   

  const totalPages = Math.ceil(totalItems / entries);

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <div>
        Showing {totalItems === 0 ? 0 : indexOfFirst + 1} to{" "}
        {Math.min(indexOfLast, totalItems)} of {totalItems} entries
      </div>

      <div className="d-flex align-items-center">
        <button
          className="btn btn-sm btn-secondary me-2"
          disabled={currentPage === 1}
          onClick={() => onPageChange((prev) => prev - 1)}
        >
          Prev
        </button>

        <span className="mx-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          className="btn btn-sm btn-secondary ms-2"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}