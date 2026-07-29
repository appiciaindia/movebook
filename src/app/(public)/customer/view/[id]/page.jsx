"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStoredUser, getUserId } from "@/lib/auth";
import CustomerPage from "@/component/customer/page";
import Pagination from "../../../../../component/common/pagination/page";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CustomerViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const user = getStoredUser();
  const userId = getUserId(user);

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
    const user = getStoredUser();
    const userId = getUserId(user);

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
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="">Customer Profile</h4>

          <small className="text-muted">View customer information</small>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => router.back()}
        >
          <i className="ri-arrow-left-line me-2"></i>
          Back
        </button>
      </div>

      {/* Customer Card */}

      <div className="card  border-0 ">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-2 text-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: 90,
                  height: 90,
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {customer.party_name?.charAt(0)}
              </div>
            </div>

            <div className="col-lg-10">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h3 className="fw-bold mb-1">{customer.party_name}</h3>

                  <p className="text-muted mb-2">
                    {customer.company_name || "Individual Customer"}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {customer.customer_id}
                  </span>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditCustomerId(customer._id);
                      setShowEditCustomerModal(true);
                    }}
                  >
                    <i className="ri-edit-line me-1"></i>
                    Edit
                  </button>
                </div>
              </div>

              <hr />

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-muted small">Mobile</div>

                  <div className="fw-semibold">{customer.mobile}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">Email</div>

                  <div className="fw-semibold">{customer.email || "-"}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">GST Number</div>

                  <div className="fw-semibold">{customer.gst_no || "-"}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">City</div>

                  <div className="fw-semibold">{customer.city}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">State</div>

                  <div className="fw-semibold">{customer.state || "-"}</div>
                </div>

                <div className="col-md-4">
                  <div className="text-muted small">Pincode</div>

                  <div className="fw-semibold">{customer.pincode || "-"}</div>
                </div>

                <div className="col-12">
                  <div className="text-muted small">Address</div>

                  <div className="fw-semibold">{customer.address || "-"}</div>
                </div>
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>All Quotations</h4>
                <button
                  onClick={() =>
                    router.push(`/quotation/add?customerId=${customer._id}`)
                  }
                  className="btn btn-primary"
                >
                  + New
                </button>
              </div>
              {quotationLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : quotations.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="mt-3">No Quotation Found</h5>
                </div>
              ) : (
                <div className="">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>

                        <th>Quotation No.</th>

                        <th>Party Name</th>

                        <th>Mobile</th>

                        <th>Date</th>

                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentData.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>

                          <td>{item.quotation_number}</td>

                          <td>{item.party_name}</td>

                          <td>{item.quotation_mobile}</td>

                          <td>{item.quotation_date}</td>

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
