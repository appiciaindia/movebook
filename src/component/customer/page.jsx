"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
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

export default function CustomerPage({ mode = "add", customerId = null,onSuccess, onClose }) {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");

  const router = useRouter();

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

  useEffect(() => {
    if (mode !== "edit" || !customerId || !userId) return;

    const loadCustomer = async () => {
      try {
        const response = await fetch(
          `/api/customer/${customerId}?userId=${encodeURIComponent(userId)}`,
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setFormData({
            ...defaultForm,
            ...result.data,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadCustomer();
  }, [mode, customerId, userId]);

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

  if (!validateForm()) return;

  if (!userId) {
    setErrors(["Unable to identify the logged-in user. Please login again."]);
    return;
  }

  setIsSubmitting(true);

  try {
    const url =
      mode === "edit"
        ? `/api/customer/${customerId}?userId=${encodeURIComponent(userId)}`
        : `/api/customer?userId=${encodeURIComponent(userId)}`;

    const method = mode === "edit" ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        userId,
        gst_no: formData.gst_no?.trim() || undefined,
        email: formData.email?.trim() || undefined,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setErrors([
        result.message ||
          (mode === "edit"
            ? "Failed to update customer"
            : "Failed to save customer"),
      ]);
      return;
    }

    setMessage(
      mode === "edit"
        ? "Customer updated successfully."
        : "Customer saved successfully."
    );

    if (mode === "add") {
      setFormData(defaultForm);
    }

    // ✅ Parent list refresh
    if (onSuccess) {
      await onSuccess();
    }

    // Optional: Modal close
   setTimeout(() => {
  setMessage("");
  setErrors([]);
  onClose?.();
}, 1000);

  } catch (error) {
    setErrors([
      error.message ||
        (mode === "edit"
          ? "Failed to update customer"
          : "Failed to save customer"),
    ]);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className={`${styles.formCard}`}>
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
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Saving..."
            : mode === "edit"
              ? "Update Customer"
              : "Save Customer"}
        </button>
      </div>
    </form>
  );
}
