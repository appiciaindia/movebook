"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Pagination from "../../../../component/common/pagination/page";

export default function QuotationsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Fetch Data
  const fetchData = async () => {
    const resu = await fetch("/api/me");
    const data = await resu.json();

    const userId = data.user?._id;

    if (!userId) return;

    const res = await fetch(
      `/api/quotation?type=list&userId=${encodeURIComponent(userId)}`,
      {
        cache: "no-store",
      },
    );
    const result = await res.json();
    setData(result.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
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
      const res = await fetch("/api/me");
      const result = await res.json();

      const userId = result.user?._id;

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
      item.quotation_company_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.quotation_number?.toLowerCase().includes(search.toLowerCase()),
  );
  const handleWhatsapp = (item) => {
    const phone = item.customer?.mobile || item.quotation_mobile;
    const message = `Hello`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };
  const handleEmail = async (item) => {
    const email = item.customer?.email || item.quotation_email;

    if (!email) {
      alert("Email not found");
      return;
    }

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        quotationId: item._id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Email sent successfully");
    } else {
      alert(data.message);
    }
  };

  // Pagination Logic
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = [...filteredData]
    .reverse()
    .slice(indexOfFirst, indexOfLast);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>All Quotations</h4>
        <Link href="/quotation/add" className="btn btn-primary">
          + New
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
      <div className="">
        <table className="table table-light table-hover">
          <thead className="">
            <tr>
              <th>#</th>
              <th>Quotation Number</th>
              <th>Party Name</th>
              <th>Company Name</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
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
                  <td>{item.quotation_mobile}</td>

                  <td>
                    <div className="dropdown">
                      <button
                        className="btn btn-light btn-sm border-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ri-more-2-fill fs-5"></i>
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li>
                          <Link
                            href={`/quotation/edit/${item._id}`}
                            className="dropdown-item"
                          >
                            <i className="ri-edit-line me-2"></i>
                            Edit
                          </Link>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              window.open(`/api/pdf/${item._id}`, "_blank")
                            }
                          >
                            <i className="ri-file-pdf-line me-2"></i>
                            PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleEmail(item)}
                          >
                            <i className="ri-mail-line me-2"></i>
                            Email
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleWhatsapp(item)}
                          >
                            <i className="ri-whatsapp-line me-2 text-success"></i>
                            WhatsApp
                          </button>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(item._id)}
                          >
                            <i className="ri-delete-bin-line me-2"></i>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        entries={entries}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
