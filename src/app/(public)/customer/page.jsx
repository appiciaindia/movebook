"use client";
import { useEffect, useState } from "react";
import CustomerPage from "@/component/customer/page";
import Pagination from "../../../component/common/pagination/page";
import React from "react";
import Swal from "sweetalert2";
import styles from "./page.module.css";
import { useRouter, useParams } from "next/navigation";
import { PiGreaterThanBold } from "react-icons/pi";

function page() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [entries, setEntries] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", {
          cache: "no-store",
        });

        if (!res.ok) {
          setUserId("");
          return;
        }

        const result = await res.json();

        if (result.success && result.user) {
          setUserId(result.user._id);
        } else {
          setUserId("");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUserId("");
      }
    };

    loadUser();
  }, []);

  const loadCustomers = async () => {
    if (!userId) return;

    try {
      const url = searchTerm
        ? `/api/customer?userId=${encodeURIComponent(userId)}&search=${encodeURIComponent(searchTerm)}`
        : `/api/customer?userId=${encodeURIComponent(userId)}`;

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        setCustomers(result.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadCustomers();
    }
  }, [userId, searchTerm, refresh]);

  // Search Filter
  const filteredData = customers.filter(
    (item) =>
      item.party_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

    if (!confirm.isConfirmed) return;

    try {
      // Logged in user
      const meRes = await fetch("/api/me", {
        cache: "no-store",
      });

      if (!meRes.ok) {
        Swal.fire("Session Expired", "Please login again.", "error");

        router.push("/login");
        return;
      }

      const meResult = await meRes.json();

      if (!meResult.success || !meResult.user) {
        Swal.fire("Error", "User not found.", "error");
        return;
      }

      const userId = meResult.user._id;

      // Delete customer
      const response = await fetch(
        `/api/customer/${id}?userId=${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        Swal.fire("Error!", result.message || "Delete failed.", "error");
        return;
      }

      setCustomers((prev) => {
        const updated = prev.filter((item) => item._id !== id);

        const newTotalPages = Math.ceil(updated.length / entries);

        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        return updated;
      });

      Swal.fire("Deleted!", "Customer has been deleted.", "success");
    } catch (error) {
      console.error(error);

      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "active",
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "inactive",
  ).length;

  const now = new Date();

  const thisMonthCustomers = customers.filter((customer) => {
    const createdDate = new Date(customer.createdAt);

    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleExport = () => {
    const headers = [
      "Customer ID",
      "Party Name",
      "Company Name",
      "Mobile",
      "Email",
      "City",
      "Status",
    ];

    const rows = filteredData.map((customer) => [
      customer.customer_id || "",
      customer.party_name || "",
      customer.company_name || "",
      customer.mobile || "",
      customer.email || "",
      customer.city || "",
      customer.status || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";

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
    <div className="container-fluid">
      <div className={styles.customerShell}>
        <div className={styles.headerRow}></div>
        {/* Customer Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h4 className="mb-1">All Customers</h4>
            <p className="text-muted small mb-0">
              Dashboard <PiGreaterThanBold size={10} /> Customers
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-3"
            onClick={() => setShowCustomerModal(true)}
          >
            <i className="ri-add-line"></i>
            New Customer
          </button>
        </div>

        {/* Customer Statistics */}
        <div className="row g-1 g-lg-3 mb-4">
          {/* Total Customers */}
          <div className="col-xl-3 col-md-3 col-6">
            <div
              className="bg-white h-100 p-2 p-md-3"
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
                  <i className="ri-group-line fs-4"></i>
                </div>

                <div className="text-center text-lg-start">
                  <p className="text-muted small mb-1">Total Customers</p>

                  <h4 className="fw-bold mb-0">{totalCustomers}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Active Customers */}
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
                    background: "#ecfdf3",
                    color: "#16a34a",
                  }}
                >
                  <i className="ri-user-follow-line fs-4"></i>
                </div>

                <div className="text-center text-lg-start">
                  <p className="text-muted small mb-1">Active Customers</p>

                  <h4 className="fw-bold mb-0">{activeCustomers}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Inactive Customers */}
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
                    background: "#fff7ed",
                    color: "#ea580c",
                  }}
                >
                  <i className="ri-user-unfollow-line fs-4"></i>
                </div>
                <div className="text-center text-lg-start">
                  <p className="text-muted small mb-1">Inactive Customers</p>

                  <h4 className="fw-bold mb-0">{inactiveCustomers}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* This Month */}
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
                  <i className="ri-user-add-line fs-4"></i>
                </div>

                <div className="text-center text-lg-start">
                  <p className="text-muted small mb-1">This Month Added</p>

                  <h4 className="fw-bold mb-0">{thisMonthCustomers}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div
          className="p-3 mb-3"
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
                  className="form-control ps-5"
                  placeholder="Search customer, company, mobile..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                    customers.map((customer) => customer.city).filter(Boolean),
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
            <div className="col-xl-2 col-lg-2 col-md-12">
              <button
                type="button"
                className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  height: "35px",
                  borderRadius: "8px",
                }}
                onClick={handleExport}
              >
                <i className="ri-download-2-line"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div
          className={`${styles.listCard} bg-white`}
          style={{
            border: "1px solid #e9ecef",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {customers.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                }}
              >
                <i
                  className="ri-user-search-line"
                  style={{
                    fontSize: "25px",
                    color: "#94a3b8",
                  }}
                />
              </div>

              <h6 className="fw-semibold mb-1">No Customers Found</h6>

              <p className="text-muted small mb-0">
                Try changing your search or add a new customer.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  <tr>
                    <th className="px-3 py-3 text-muted small fw-semibold">
                      #
                    </th>

                    <th className="py-3 text-muted small fw-semibold">
                      Customer ID
                    </th>

                    <th className="py-3 text-muted small fw-semibold">
                      Party Name
                    </th>

                    <th className="py-3 text-muted small fw-semibold">
                      Company Name
                    </th>

                    <th className="py-3 text-muted small fw-semibold">
                      Mobile
                    </th>

                    <th className="py-3 text-muted small fw-semibold">Email</th>

                    {/* City */}
                    <th className="py-3 text-muted small fw-semibold">City</th>

                    {/* Status */}
                    <th className="py-3 text-muted small fw-semibold">
                      Status
                    </th>

                    <th className="py-3 text-center text-muted small fw-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.map((customer, index) => (
                    <tr key={customer._id}>
                      {/* Number */}
                      <td className="px-3 text-muted small">
                        {indexOfFirst + index + 1}
                      </td>

                      {/* Customer ID */}
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: "#eef2ff",
                            color: "#4f46e5",
                            fontWeight: 500,
                            padding: "6px 9px",
                          }}
                        >
                          {customer.customer_id}
                        </span>
                      </td>

                      {/* Party Name */}
                      <td>
                        <div className="fw-semibold">{customer.party_name}</div>
                      </td>

                      {/* Company */}
                      <td>
                        <span className="text-muted">
                          {customer.company_name || "-"}
                        </span>
                      </td>

                      {/* Mobile */}
                      <td>
                        <div className="">
                          

                          <span>{customer.mobile || "-"}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div className="">
                         

                          <span className="text-muted">
                            {customer.email || "-"}
                          </span>
                        </div>
                      </td>

                      {/* City */}
                      <td>
                        <div className="">
                         

                          <span>{customer.city || "-"}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        {customer.status?.toLowerCase() === "active" ? (
                          <span
                            className="badge d-inline-flex align-items-center gap-1"
                            style={{
                              background: "#ecfdf3",
                              color: "#15803d",
                              fontWeight: 500,
                              padding: "6px 9px",
                              borderRadius: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#16a34a",
                              }}
                            />
                            Active
                          </span>
                        ) : (
                          <span
                            className="badge d-inline-flex align-items-center gap-1"
                            style={{
                              background: "#fef2f2",
                              color: "#dc2626",
                              fontWeight: 500,
                              padding: "6px 9px",
                              borderRadius: "6px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#dc2626",
                              }}
                            />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="text-center">
                        <div className="dropdown">
                          <button
                            className="btn btn-light btn-sm border"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "8px",
                            }}
                          >
                            <i className="ri-more-2-fill"></i>
                          </button>

                          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                            {/* View */}
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center gap-2"
                                onClick={() =>
                                  router.push(`/customer/view/${customer._id}`)
                                }
                              >
                                <i className="ri-eye-line"></i>
                                View
                              </button>
                            </li>

                            {/* Edit */}
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center gap-2"
                                onClick={() => {
                                  setEditCustomerId(customer._id);
                                  setShowEditCustomerModal(true);
                                }}
                              >
                                <i className="ri-edit-line"></i>
                                Edit
                              </button>
                            </li>

                            {/* Quotation */}
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center gap-2"
                                onClick={() =>
                                  router.push(
                                    `/quotation/add?customerId=${customer._id}`,
                                  )
                                }
                              >
                                <i className="ri-file-list-3-line"></i>
                                Quotation
                              </button>
                            </li>

                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            {/* Delete */}
                            <li>
                              <button
                                className="dropdown-item text-danger d-flex align-items-center gap-2"
                                onClick={() => handleDelete(customer._id)}
                              >
                                <i className="ri-delete-bin-line"></i>
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

        {/* Pagination */}
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredData.length}
            entries={entries}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add Modal */}
        <div
          className={`modal fade ${showCustomerModal ? "show d-block" : ""}`}
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            display: showCustomerModal ? "block" : "none",
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">Add Customer</h5>
                  <small className="text-muted">
                    Add a new customer to your list
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCustomerModal(false)}
                />
              </div>

              <div className="modal-body">
                <CustomerPage
                  setCustomers={setCustomers}
                  mode="add"
                  onSuccess={loadCustomers}
                  onClose={() => setShowCustomerModal(false)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div
          className={`modal fade ${
            showEditCustomerModal ? "show d-block" : ""
          }`}
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            display: showEditCustomerModal ? "block" : "none",
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold">Edit Customer</h5>
                  <small className="text-muted">
                    Update customer information
                  </small>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditCustomerModal(false)}
                />
              </div>

              <div className="modal-body">
                <CustomerPage
                  setCustomers={setCustomers}
                  mode="edit"
                  customerId={editCustomerId}
                  onSuccess={loadCustomers}
                  onClose={() => setShowEditCustomerModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
