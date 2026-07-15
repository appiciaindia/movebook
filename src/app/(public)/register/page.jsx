"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStoredUser, getUserId } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const user = getStoredUser();
    const userId = getUserId(user);

    if (!userId) {
      setFeedback("Session expired. Please login again.");
      setIsSubmitting(false);
      return;
    }

    formData.append("userId", userId);

    try {
      const response = await fetch(`/api/profile?userId=${encodeURIComponent(userId || "")}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Registration failed");
      }

      setFeedback("Registration saved successfully.");
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      setFeedback(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`container-fluid bg-white p-4 ${styles.pageContainer}`}>
      <div className="row justify-content-center align-items-center">
        <div className={`col-lg-12 p-4 ${styles.registerContainer}`}>
          <div className="row g-0 align-items-center">
            <div className="col-lg-12">
              <div className={styles.formBox}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Company Registration</h2>
                  <p className="text-muted">
                    Fill in your business details to create an account.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4 mb-3">
                    <div className="col-lg-6">
                      <div className="">
                        <label
                          htmlFor="full_name"
                          className="form-label text-muted small"
                        >
                          Full Name
                        </label>
                        <input
                          id="full_name"
                          name="full_name"
                          type="text"
                          className={`form-control ${styles.formInput}`}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="">
                        <label
                          htmlFor="company_name"
                          className="form-label text-muted small"
                        >
                          Company Name
                        </label>
                        <input
                          id="company_name"
                          name="company_name"
                          type="text"
                          className={`form-control ${styles.formInput}`}
                          placeholder="Enter company name"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="">
                        <label htmlFor="email" className="form-label text-muted small">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`form-control ${styles.formInput}`}
                          placeholder="Enter email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="">
                        <label
                          htmlFor="contact_number_one"
                          className="form-label text-muted small"
                        >
                          Business Phone 1
                        </label>
                        <input
                          id="contact_number_one"
                          name="contact_number_one"
                          type="tel"
                          className={`form-control ${styles.formInput}`}
                          placeholder="Enter business phone"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="">
                        <label
                          htmlFor="contact_number_two"
                          className="form-label text-muted small"
                        >
                          Business Phone 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          id="contact_number_two"
                          name="contact_number_two"
                          type="tel"
                          className={`form-control ${styles.formInput}`}
                          placeholder="Enter business phone 2"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="">
                        <label htmlFor="website" className="form-label text-muted small">
                          Website <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          className={`form-control ${styles.formInput}`}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="gst_number" className="form-label text-muted small">
                        GSTIN <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        id="gst_number"
                        name="gst_number"
                        type="text"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Enter GSTIN"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="pan_number" className="form-label text-muted small">
                        PAN
                      </label>
                      <input
                        id="pan_number"
                        name="pan_number"
                        type="text"
                        className={`form-control ${styles.formInput}`}
                        placeholder="Enter PAN"
                        required
                      />
                    </div>
                    <div className="col-lg-4">
                      <div className="">
                        <label htmlFor="company_logo" className="form-label text-muted small">
                          Company Logo
                        </label>
                        <input
                          id="company_logo"
                          name="company_logo"
                          type="file"
                          accept="image/*"
                          className={`form-control ${styles.formInput}`}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="">
                        <label htmlFor="pan_card" className="form-label text-muted small">
                          Upload PAN Card
                        </label>
                        <input
                          id="pan_card"
                          name="pan_card"
                          type="file"
                          accept="image/*,application/pdf"
                          className={`form-control ${styles.formInput}`}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div>
                        <label htmlFor="address" className="form-label text-muted small">
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          rows={4}
                          className="form-control"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {feedback ? (
                    <div className="alert alert-info text-center mb-3" role="status">
                      {feedback}
                    </div>
                  ) : null}

                  <div className="text-center">
                    <button
                      type="submit"
                      className={`btn ${styles.submitButton}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Register"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
