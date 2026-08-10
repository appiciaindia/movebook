"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CustomerPage from "@/component/customer/page";
import Pagination from "../../../../../component/common/pagination/page";
import Link from "next/link";
import Swal from "sweetalert2";
import { PiGreaterThanBold } from "react-icons/pi";

export default function CustomerViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("quotation");
  const [quotations, setQuotations] = useState([]);
  const [quotationLoading, setQuotationLoading] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);

  // Customers Load In ui
  const fetchCustomer = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/customer/${id}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setCustomer(result.data);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id, refresh]);

  // Model Open
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  //  Quotation Load In ui
  const loadQuotations = async () => {
    const res = await fetch("/api/me");
    const result = await res.json();

    const userId = result.user?._id;

    if (!id || !userId) return;

    try {
      setQuotationLoading(true);

      const response = await fetch(
        `/api/quotation?type=list&userId=${encodeURIComponent(
          userId,
        )}&customerId=${id}`,
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setQuotations(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setQuotationLoading(false);
    }
  };

  //Email Send
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
  const filteredData = quotations.filter(
    (item) =>
      item.party_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.quotation_company_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.quotation_number?.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination Logic
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = [...filteredData]
    .reverse()
    .slice(indexOfFirst, indexOfLast);

  // Tabs Active
  useEffect(() => {
    if (activeTab === "quotation") {
      loadQuotations();
    }
  }, [activeTab, id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Customer not found.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Customer Profile Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className=" mb-1">
            {" "}
            <span className="" onClick={() => router.back()}>
              <i className="ri-arrow-left-line fs-4"></i>
            </span>{" "}
            Customer Profile
          </h4>
          <p className="text-muted small mb-0">
            Dashboard <PiGreaterThanBold size={10} /> Customers{" "}
            <PiGreaterThanBold size={10} /> Customers Profile
          </p>
        </div>

        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2 d-none d-lg-block"
          onClick={() => router.back()}
        >
          <i className="ri-arrow-left-line"></i>
          Back
        </button>
      </div>

      {/* Customer Profile Card */}
      <div
        className="bg-white"
        style={{
          border: "1px solid #e9ecef",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {/* Profile Top */}
        <div
          className="p-4"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
            {/* Avatar */}
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "16px",
                background: "#eef2ff",
                color: "#4f46e5",
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              {customer.party_name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Customer Name */}
            <div className="text-center text-md-start flex-grow-1">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-2">
                <h3 className="fw-bold mb-0">{customer.party_name}</h3>

                {customer.status && (
                  <span
                    className="badge d-inline-flex align-items-center gap-1"
                    style={{
                      background:
                        customer.status?.toLowerCase() === "active"
                          ? "#ecfdf3"
                          : "#fef2f2",
                      color:
                        customer.status?.toLowerCase() === "active"
                          ? "#15803d"
                          : "#dc2626",
                      padding: "6px 9px",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background:
                          customer.status?.toLowerCase() === "active"
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    />
                    {customer.status}
                  </span>
                )}
              </div>

              <p className="text-muted mb-2 mt-1">
                {customer.company_name || "Individual Customer"}
              </p>

              <span
                className="badge"
                style={{
                  background: "#eef2ff",
                  color: "#4f46e5",
                  padding: "6px 10px",
                  fontWeight: 500,
                }}
              >
                {customer.customer_id}
              </span>
            </div>

            {/* Edit */}
            <button
              className="btn btn-primary d-flex align-items-center gap-2 px-3"
              onClick={() => {
                setEditCustomerId(customer._id);
                setShowEditCustomerModal(true);
              }}
            >
              <i className="ri-edit-line"></i>
              Edit Customer
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-4 border-top">
          <div className="row g-3">
            {/* Mobile */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-phone-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">Mobile</span>
                </div>

                <div className="fw-semibold">{customer.mobile || "-"}</div>
              </div>
            </div>

            {/* Email */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-mail-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">Email</span>
                </div>

                <div className="fw-semibold text-break">
                  {customer.email || "-"}
                </div>
              </div>
            </div>

            {/* GST */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-file-text-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">GST Number</span>
                </div>

                <div className="fw-semibold">{customer.gst_no || "-"}</div>
              </div>
            </div>

            {/* City */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-map-pin-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">City</span>
                </div>

                <div className="fw-semibold">{customer.city || "-"}</div>
              </div>
            </div>

            {/* State */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-government-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">State</span>
                </div>

                <div className="fw-semibold">{customer.state || "-"}</div>
              </div>
            </div>

            {/* Pincode */}
            <div className="col-xl-4 col-md-6">
              <div
                className="p-3 h-100"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-map-pin-2-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">Pincode</span>
                </div>

                <div className="fw-semibold">{customer.pincode || "-"}</div>
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <div
                className="p-3"
                style={{
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i
                    className="ri-home-4-line"
                    style={{
                      color: "#4f46e5",
                      fontSize: "18px",
                    }}
                  />
                  <span className="text-muted small">Address</span>
                </div>

                <div className="fw-semibold">{customer.address || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 rounded-4 mt-4">
        <div className="card-header bg-white">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "quotation" ? "active" : ""
                }`}
                onClick={() => setActiveTab("quotation")}
              >
                <i className="ri-file-list-3-line me-2"></i>
                Quotations
                <span className="badge bg-light text-dark ms-2">
                  {quotations.length}
                </span>
              </button>
            </li>

            <li className="nav-item ms-2">
              <button
                className={`nav-link ${
                  activeTab === "invoice" ? "active" : ""
                }`}
                onClick={() => setActiveTab("invoice")}
              >
                Invoice
              </button>
            </li>

            <li className="nav-item ms-2">
              <button
                className={`nav-link ${activeTab === "bilty" ? "active" : ""}`}
                onClick={() => setActiveTab("bilty")}
              >
                Bilty
              </button>
            </li>

            <li className="nav-item ms-2">
              <button
                className={`nav-link ${activeTab === "money" ? "active" : ""}`}
                onClick={() => setActiveTab("money")}
              >
                Money Receipt
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {activeTab === "quotation" && (
            <>
              {/* Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Quotations</h5>

                  <p className="text-muted small mb-0">
                    Manage all quotations for this customer
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(`/quotation/add?customerId=${customer._id}`)
                  }
                  className="btn btn-primary d-flex align-items-center gap-2"
                >
                  <i className="ri-add-line"></i>
                  New Quotation
                </button>
              </div>
              {quotationLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : quotations.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#f1f5f9",
                    }}
                  >
                    <i
                      className="ri-file-list-3-line"
                      style={{
                        fontSize: "28px",
                        color: "#94a3b8",
                      }}
                    />
                  </div>

                  <h6 className="fw-semibold mb-1">No Quotations Found</h6>

                  <p className="text-muted small mb-3">
                    Create your first quotation for this customer.
                  </p>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      router.push(`/quotation/add?customerId=${customer._id}`)
                    }
                  >
                    <i className="ri-add-line me-1"></i>
                    Create Quotation
                  </button>
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

                        <th className="py-3 text-muted small fw-semibold">
                          Amount
                        </th>

                        <th className="py-3 text-muted small fw-semibold">
                          Date
                        </th>

                        <th className="py-3 text-muted small fw-semibold">
                          Status
                        </th>

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

                          {/* Status */}
                          <td>
                            {(() => {
                              const status =
                                item.status?.toLowerCase() || "pending";

                              const statusConfig = {
                                pending: {
                                  label: "Pending",
                                  bg: "#fff7ed",
                                  color: "#c2410c",
                                  dot: "#f97316",
                                },
                                approved: {
                                  label: "Approved",
                                  bg: "#ecfdf3",
                                  color: "#15803d",
                                  dot: "#16a34a",
                                },
                                rejected: {
                                  label: "Rejected",
                                  bg: "#fef2f2",
                                  color: "#dc2626",
                                  dot: "#dc2626",
                                },
                                sent: {
                                  label: "Sent",
                                  bg: "#eff6ff",
                                  color: "#2563eb",
                                  dot: "#3b82f6",
                                },
                                draft: {
                                  label: "Draft",
                                  bg: "#f1f5f9",
                                  color: "#475569",
                                  dot: "#64748b",
                                },
                              };

                              const config =
                                statusConfig[status] || statusConfig.pending;

                              return (
                                <span
                                  className="badge d-inline-flex align-items-center gap-1"
                                  style={{
                                    background: config.bg,
                                    color: config.color,
                                    padding: "6px 9px",
                                    borderRadius: "6px",
                                    fontWeight: 500,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "6px",
                                      height: "6px",
                                      borderRadius: "50%",
                                      background: config.dot,
                                    }}
                                  />

                                  {config.label}
                                </span>
                              );
                            })()}
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
                                      window.open(
                                        `/api/pdf/${item._id}`,
                                        "_blank",
                                      )
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
              {/* Pagination UI */}
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={filteredData.length}
                entries={entries}
              />
            </>
          )}

          {activeTab === "invoice" && (
            <div className="text-center py-5">
              <h4>Invoice Module Coming Soon</h4>
            </div>
          )}

          {activeTab === "bilty" && (
            <div className="text-center py-5">
              <h4>Bilty Module Coming Soon</h4>
            </div>
          )}

          {activeTab === "money" && (
            <div className="text-center py-5">
              <h4>Money Receipt Module Coming Soon</h4>
            </div>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      <div
        className={`modal fade ${showEditCustomerModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          backgroundColor: "rgba(0,0,0,.5)",
          display: showEditCustomerModal ? "block" : "none",
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Customer</h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditCustomerModal(false)}
              />
            </div>

            <div className="modal-body">
              <div className="container-fluid ">
                <CustomerPage
                  setCustomers={setCustomers}
                  mode="edit"
                  customerId={editCustomerId}
                  onSuccess={fetchCustomer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
