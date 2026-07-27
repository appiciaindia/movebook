"use client";
import { useEffect, useState } from "react";
import CustomerPage from "@/component/customer/page";
import Pagination from "../../../component/common/pagination/page";
import React from "react";
import Swal from "sweetalert2";
import { getStoredUser, getUserId } from "@/lib/auth";
import styles from "./page.module.css";
import { useRouter, useParams } from "next/navigation";

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
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    const id = getUserId(user);
    setUserId(id || "");
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
  }, [userId, searchTerm , refresh]);

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
      const user = getStoredUser();
      const userId = getUserId(user);

      const response = await fetch(
        `/api/customer/${id}?userId=${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setCustomers((prev) => {
          const updated = prev.filter((item) => item._id !== id);

          const newTotalPages = Math.ceil(updated.length / entries);

          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          return updated;
        });

        Swal.fire("Deleted!", "Customer has been deleted.", "success");
      } else {
        Swal.fire("Error!", result.message || "Delete failed.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Pagination Logic
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container-fluid p-4">
      <div className={styles.customerShell}>
        <div className={styles.headerRow}></div>
        {/* Search + Entries */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="">
            <h3 className="fw-bold mb-1">All Customers</h3>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-end mb-2">
              <button
                type="button"
                className="btn text-white bg-primary border-0"
                onClick={() => setShowCustomerModal(true)}
              >
                + New
              </button>
            </div>

            <select
              className="form-select"
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
        </div>

        <div className={`{styles.listCard} mt-4`}>
          {customers.length === 0 ? (
            <div className="text-muted">No customers found.</div>
          ) : (
            <div className="">
              <table className="table table-hover table-light">
                <thead className="">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Party Name</th>
                    <th>Company Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    {/* <th>GST</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {currentData.map((customer, index) => (
                    <tr key={customer._id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{customer.customer_id}</td>
                      <td>{customer.party_name}</td>
                      <td>{customer.company_name || "-"}</td>
                      <td>{customer.mobile}</td>

                      <td>{customer.email || "-"}</td>
                      {/* <td>{customer.gst_no || "-"}</td> */}
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
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  router.push(`/customer/view/${customer._id}`)
                                }
                              >
                                <i className="ri-eye-line me-2"></i>
                                View
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                // onClick={() =>
                                //   router.push(`/customer/edit/${customer._id}`)
                                // }
                                onClick={() => {
                                  setEditCustomerId(customer._id);
                                  setShowEditCustomerModal(true);
                                }}
                              >
                                <i className="ri-edit-line me-2"></i>
                                Edit
                              </button>
                            </li>

                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  router.push(
                                    `/quotation/add?customerId=${customer._id}`,
                                  )
                                }
                              >
                                <i className="ri-file-list-3-line me-2"></i>
                                Quotation
                              </button>
                            </li>

                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(customer._id)}
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
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Customer</h5>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCustomerModal(false)}
              />
            </div>

            <div className="modal-body">
              <div className="container-fluid ">
                <CustomerPage setCustomers={setCustomers} mode="add"   onSuccess={loadCustomers} />
              </div>
            </div>
          </div>
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
                  onSuccess={loadCustomers}
                />
              </div>
            </div>
          </div>
        </div>
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

export default page;
