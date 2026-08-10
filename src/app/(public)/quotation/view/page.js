"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Pagination from "../../../../component/common/pagination/page";
import { PiGreaterThanBold } from "react-icons/pi";

export default function QuotationsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [quotationData, setQuotationData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

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

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No quotation data available to export.");
      return;
    }

    const headers = [
      "Quotation No.",
      "Party Name",
      "Company",
      "Mobile",
      "Email",
      "City",
      "Amount",
      "Status",
      "Date",
    ];

    const rows = filteredData.map((item) => [
      item.quotation_number || "",
      item.party_name || "",
      item.quotation_company_name || "",
      item.quotation_mobile || "",
      item.quotation_email || "",
      item.origin_city || "",
      Number(item.grand_total ?? item.total_amount ?? item.amount ?? 0).toFixed(
        2,
      ),
      item.status || "Pending",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN")
        : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `quotations-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="mb-1">All Quotations</h4>

          <p className="text-muted small mb-0">
            Dashboard <PiGreaterThanBold size={10} /> Quotations
          </p>
        </div>

        <Link
          href="/quotation/add"
          className="btn btn-primary d-flex align-items-center gap-2 px-3"
          style={{
            height: "42px",
            borderRadius: "8px",
          }}
        >
          <i className="ri-add-line"></i>
          New Quotation
        </Link>
      </div>

      {/* Quotation Statistics */}
      <div className="row g-3 mb-4">
        {/* Total */}
        <div className="col-xl-3 col-md-3 col-6">
          <div
            className="bg-white h-100 p-2 p-lg-3"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "10px",
                  background: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                <i className="ri-file-list-3-line fs-4"></i>
              </div>
              <div className="text-center text-lg-start">
                <p className="text-muted small mb-1">Total Quotations</p>

                <h4 className="fw-bold mb-0">{quotationData.length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className="col-xl-3 col-md-3 col-6">
          <div
            className="bg-white h-100 p-2 p-lg-3"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <i className="ri-draft-line fs-4"></i>
              </div>
              <div className="text-center text-lg-start">
                <p className="text-muted small mb-1">Draft Quotations</p>

                <h4 className="fw-bold mb-0">
                  {
                    quotationData.filter(
                      (item) => item.status?.toLowerCase() === "draft",
                    ).length
                  }
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Sent */}
        <div className="col-xl-3 col-md-3 col-6">
          <div
            className="bg-white h-100 p-2 p-lg-3"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "10px",
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                <i className="ri-send-plane-line fs-4"></i>
              </div>
              <div className="text-center text-lg-start">
                <p className="text-muted small mb-1">Sent Quotations</p>

                <h4 className="fw-bold mb-0">
                  {
                    quotationData.filter(
                      (item) => item.status?.toLowerCase() === "sent",
                    ).length
                  }
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="col-xl-3 col-md-3 col-6">
          <div
            className="bg-white h-100 p-2 p-lg-2"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "10px",
                  background: "#ecfdf3",
                  color: "#16a34a",
                }}
              >
                <i className="ri-checkbox-circle-line fs-4"></i>
              </div>
              <div className="text-center text-lg-start">
                <p className="text-muted small mb-1">Approved Quotations</p>

                <h4 className="fw-bold mb-0">
                  {
                    quotationData.filter(
                      (item) => item.status?.toLowerCase() === "approved",
                    ).length
                  }
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div
        className="p-3 mb-4"
        style={{
          background: "#fff",
          border: "1px solid #e9ecef",
          borderRadius: "12px",
        }}
      >
        <div className="row align-items-center g-4">
          {/* Search */}
          <div className="col-xl-4 col-lg-4 col-md-6">
            <div className="position-relative">
              <i
                className="ri-search-line position-absolute"
                style={{
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8a94a6",
                  fontSize: "18px",
                  zIndex: 2,
                }}
              />

              <input
                type="text"
                placeholder="Search quotation, customer, company..."
                className="form-control ps-5"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  height: "35px",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="col-xl-2 col-lg-2 col-md-6">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: "35px",
                borderRadius: "8px",
              }}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* City */}
          <div className="col-xl-2 col-lg-2 col-md-6">
            <select
              className="form-select"
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: "35px",
                borderRadius: "8px",
              }}
            >
              <option value="">All Cities</option>

              {[
                ...new Set(
                  quotationData.map((item) => item.origin_city).filter(Boolean),
                ),
              ].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Entries */}
          <div className="col-xl-2 col-lg-2 col-md-6">
            <select
              className="form-select"
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                height: "35px",
                borderRadius: "8px",
              }}
            >
              <option value={10}>10 Entries</option>
              <option value={25}>25 Entries</option>
              <option value={50}>50 Entries</option>
            </select>
          </div>

          {/* Export */}
          <div className="col-xl-2 col-lg-2 col-md-6">
            <button
              type="button"
              className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleExport}
              style={{
                height: "35px",
                borderRadius: "8px",
              }}
            >
              <i className="ri-download-2-line"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table / Empty State */}
      <div
        className="bg-white"
        style={{
          border: "1px solid #e9ecef",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {currentData.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#f1f5f9",
              }}
            >
              <i
                className="ri-file-list-3-line"
                style={{
                  fontSize: "30px",
                  color: "#94a3b8",
                }}
              />
            </div>

            <h6 className="fw-semibold mb-1">No Quotations Found</h6>

            <p className="text-muted small mb-3">
              Create your first quotation to get started.
            </p>

            <Link
              href="/quotation/add"
              className="btn btn-primary btn-sm px-3"
              style={{
                borderRadius: "7px",
              }}
            >
              <i className="ri-add-line me-1"></i>
              Create Quotation
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th className="px-3 py-3 text-muted small">#</th>

                  <th className="py-3 text-muted small">Quotation No.</th>

                  <th className="py-3 text-muted small">Party Name</th>

                  <th className="py-3 text-muted small">Mobile</th>

                  <th className="py-3 text-muted small fw-semibold">Amount</th>

                  <th className="py-3 text-muted small fw-semibold">Date</th>

                  <th className="py-3 text-muted small fw-semibold">View</th>

                  <th className="py-3 text-center text-muted small fw-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                          padding: "7px 10px",
                          fontWeight: 500,
                        }}
                      >
                        {item.quotation_number}
                      </span>
                    </td>

                    <td>{item.party_name}</td>

                    <td>{item.quotation_mobile}</td>

                    {/* Amount */}
                    <td>
                      <span className="fw-semibold">
                        ₹{" "}
                        {Number(
                          item.grand_total ??
                            item.total_amount ??
                            item.amount ??
                            0,
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    <td>{item.quotation_date}</td>

                    {/* View */}
                    <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      window.open(`/api/pdf/${item._id}`, "_blank")
                    }
                  >
                   <i className="ri-eye-line"></i>
                  </button>
                    </td>

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
                ))}
              </tbody>
            </table>
          </div>
        )}
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
