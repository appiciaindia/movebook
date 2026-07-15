"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getStoredUser, getUserId } from "@/lib/auth";
import { useRouter } from "next/navigation";

const defaultForm = {
  party_name: "",
  company_name: "",
  gst_no: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CustomerPage() {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    const id = getUserId(user);
    setUserId(id || "");
  }, []);

  useEffect(() => {
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

    loadCustomers();
  }, [searchTerm, userId]);

  const validateForm = () => {
    const validationErrors = [];
    const trimmed = {
      party_name: formData.party_name.trim(),
      company_name: formData.company_name.trim(),
      gst_no: formData.gst_no.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    if (!trimmed.party_name) {
      validationErrors.push("Party Name is required");
    }
    if (!trimmed.mobile) {
      validationErrors.push("Mobile is required");
    } else if (!/^[0-9]{10}$/.test(trimmed.mobile)) {
      validationErrors.push("Enter a valid 10-digit mobile number");
    }
    if (!trimmed.city) {
      validationErrors.push("City is required");
    }
    if (trimmed.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      validationErrors.push("Enter a valid email address");
    }
    if (
      trimmed.gst_no &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(trimmed.gst_no)
    ) {
      validationErrors.push("Enter a valid GST number");
    }
    if (trimmed.pincode && !/^[0-9]{5,6}$/.test(trimmed.pincode)) {
      validationErrors.push("Enter a valid pincode");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrors([]);

    if (!validateForm()) {
      return;
    }

    if (!userId) {
      setErrors(["Unable to identify the logged-in user. Please login again."]);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/customer?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId }),
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        setErrors([result.message || "Failed to save customer"]);
        return;
      }

      setMessage("Customer saved successfully.");
      setFormData(defaultForm);
      setCustomers((prev) => [result.data, ...prev]);
    } catch (error) {
      setErrors([error.message || "Failed to save customer"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className={styles.customerShell}>
        <div className={styles.headerRow}>
          <div>
            <h3 className="fw-bold mb-1">Customers</h3>
            <p className="text-muted mb-0">
              Add customer details and see saved records below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`${styles.formCard} mb-4`}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Party Name *</label>
              <input
                name="party_name"
                type="text"
                className="form-control"
                value={formData.party_name}
                onChange={handleChange}
                placeholder="Enter party name"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Company Name</label>
              <input
                name="company_name"
                type="text"
                className="form-control"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">GST No</label>
              <input
                name="gst_no"
                type="text"
                className="form-control"
                value={formData.gst_no}
                onChange={(event) =>
                  handleChange({
                    target: {
                      name: "gst_no",
                      value: event.target.value.toUpperCase(),
                    },
                  })
                }
                placeholder="Enter GSTIN"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Mobile *</label>
              <input
                name="mobile"
                type="tel"
                className="form-control"
                value={formData.mobile}
                onChange={(event) =>
                  handleChange({
                    target: {
                      name: "mobile",
                      value: event.target.value.replace(/\D/g, ""),
                    },
                  })
                }
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">City *</label>
              <input
                name="city"
                type="text"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">State</label>
              <input
                name="state"
                type="text"
                className="form-control"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Pincode</label>
              <input
                name="pincode"
                type="text"
                className="form-control"
                value={formData.pincode}
                onChange={(event) =>
                  handleChange({
                    target: {
                      name: "pincode",
                      value: event.target.value.replace(/\D/g, ""),
                    },
                  })
                }
                placeholder="Enter pincode"
                maxLength={6}
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="alert alert-danger mt-3">
              <ul className="mb-0">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {message && <div className="alert alert-success mt-3">{message}</div>}

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>

        <div className={styles.listCard}>
          <div className="row mb-3 justify-content-end">
            <div className="col-md-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Mobile, Email, GST"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <span className="input-group-text bg-dark text-white">
                  Search
                </span>
              </div>
            </div>
          </div>
          <h5 className="mb-3">Saved Customers</h5>
          {customers.length === 0 ? (
            <div className="text-muted">No customers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Party Name</th>
                    <th>Company</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Email</th>
                    <th>GST</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.customer_id}</td>
                      <td>{customer.party_name}</td>
                      <td>{customer.company_name || "-"}</td>
                      <td>{customer.mobile}</td>
                      <td>{customer.city}</td>
                      <td>{customer.email || "-"}</td>
                      <td>{customer.gst_no || "-"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            router.push(
                              `/quotation/add?customerId=${customer._id}`,
                            )
                          }
                        >
                          Quotation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
