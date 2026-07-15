"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { getStoredUser, getUserId } from "@/lib/auth";

export default function QuotationsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Fetch Data
  const fetchData = async () => {
    const user = getStoredUser();
    const userId = getUserId(user);

    if (!userId) return;

    const res = await fetch(`/api/quotation?type=list&userId=${encodeURIComponent(userId)}`, {
      cache: "no-store",
    });
    const result = await res.json();
    setData(result.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 👇 Back navigation fix
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Delete with SweetAlert
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const user = getStoredUser();
      const userId = getUserId(user);

      await fetch(`/api/quotation/${id}?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });

      Swal.fire("Deleted!", "Quotation has been deleted.", "success");
      fetchData();
    }
  };

  // Search Filter
  const filteredData = data.filter(
    (item) =>
      item.party_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.quotation_company_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.quotation_number?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination Logic
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / entries);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>All Quotations</h4>
        <Link href="/quotation/add" className="btn btn-primary">
          + Add Quotation
        </Link>
      </div>

      {/* Search + Entries */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="form-control w-25"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select w-25"
          value={entries}
          onChange={(e) => {
            setEntries(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10 Entries</option>
          <option value={25}>25 Entries</option>
          <option value={50}>50 Entries</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Quotation Number</th>
              <th>Party Name</th>
              <th>Company Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.quotation_number}</td>
                  <td>{item.party_name}</td>
                  <td>{item.quotation_company_name}</td>

                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        href={`/quotation/edit/${item._id}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          window.open(`/api/pdf/${item._id}`, "_blank")
                        }
                        className="btn btn-success btn-sm"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredData.length)} of {filteredData.length}{" "}
          entries
        </div>

        <div>
          <button
            className="btn btn-sm btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-sm btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
