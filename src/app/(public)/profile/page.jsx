"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { clearAuthSession, getStoredUser, getUserId } from "@/lib/auth";


const defaultForm = {
  full_name: "",
  company_name: "",
  email: "",
  contact_number_one: "",
  contact_number_two: "",
  website: "",
  gst_number: "",
  pan_number: "",
  address: "",
  state: "",
  city: "",
  beneficiary_name: "",
  bank_name: "",
  account_number: "",
  ifsc: "",
  branch: "",
  upi_id_one: "",
  upi_id_two: "",
  phonepay: "",
};

const businessFields = [
  ["full_name", "Full Name", "text"],
  ["company_name", "Company Name", "text"],
  ["email", "Email", "email"],
  ["contact_number_one", "Business Phone 1", "tel"],
  ["contact_number_two", "Business Phone 2", "tel"],
  ["website", "Website", "url"],
  ["gst_number", "GSTIN", "text"],
  ["pan_number", "PAN", "text"],
  ["state", "State", "text"],
  ["city", "City", "text"],
];

const bankFields = [
  ["beneficiary_name", "Beneficiary Name"],
  ["bank_name", "Bank Name"],
  ["account_number", "Account Number"],
  ["ifsc", "IFSC Code"],
  ["branch", "Branch"],
];

const upiFields = [
  ["upi_id_one", "UPI ID 1"],
  ["upi_id_two", "UPI ID 2"],
  ["phonepay", "PhonePe Number"],
];

function toForm(profile) {
  return Object.keys(defaultForm).reduce((acc, key) => {
    acc[key] = profile?.[key] || "";
    return acc;
  }, {});
}

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultForm);
  const [logoPreview, setLogoPreview] = useState("");
  const [panCardPreview, setPanCardPreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");
  const [files, setFiles] = useState({
    company_logo: null,
    pan_card: null,
    signature: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getStoredUser();
        const userId = getUserId(user);

        if (!userId) {
          setMessage("User not found. Please login again.");
          return;
        }

        const response = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`);
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setFormData(toForm(result.data));
          setLogoPreview(result.data.company_logo || "");
          setPanCardPreview(result.data.pan_card || "");
          setSignaturePreview(result.data.signature || "");
        }
      } catch {
        setMessage("Profile load failed.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    const file = selectedFiles?.[0] || null;

    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (!file) {
      return;
    }

    const preview = URL.createObjectURL(file);

    if (name === "company_logo") {
      setLogoPreview(preview);
    } else if (name === "pan_card") {
      setPanCardPreview(preview);
    } else if (name === "signature") {
      setSignaturePreview(preview);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    Object.entries(files).forEach(([key, value]) => {
      if (value) {
        form.append(key, value);
      }
    });

    try {
      const user = getStoredUser();
      const userId = getUserId(user);

      if (!userId) {
        throw new Error("User not found. Please login again.");
      }

      form.append("userId", userId);

      const response = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`, {
        method: "PUT",
        body: form,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed");
      }

      setFormData(toForm(result.data));
      setLogoPreview(result.data.company_logo || "");
      setPanCardPreview(result.data.pan_card || "");
      setSignaturePreview(result.data.signature || "");
      setFiles({ company_logo: null, pan_card: null, signature: null });
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessage(error.message || "Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <div className="container-fluid p-4">
      <div className={styles.profileShell}>
        <div className={styles.profileHeader}>
          <div>
            <h3 className="fw-bold mb-1">Profile Details</h3>
            <p className="text-muted mb-0">Update company and bank details.</p>
          </div>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={styles.uploadPanel}>
                <h5>Business Logo</h5>
                {logoPreview ? (
                  <img src={logoPreview} alt="Company logo" />
                ) : (
                  <div className={styles.emptyPreview}>Logo</div>
                )}
                <input
                  type="file"
                  name="company_logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className={styles.uploadPanel}>
                <h5>PAN Card</h5>
                {panCardPreview ? (
                  <a href={panCardPreview} target="_blank" rel="noreferrer">
                    View PAN Card
                  </a>
                ) : (
                  <div className={styles.emptyPreview}>PAN</div>
                )}
                <input
                  type="file"
                  name="pan_card"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className={styles.uploadPanel}>
                <h5>Signature / Stamp</h5>
                {signaturePreview ? (
                  <img src={signaturePreview} alt="Signature" />
                ) : (
                  <div className={styles.emptyPreview}>Sign</div>
                )}
                <input
                  type="file"
                  name="signature"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className="col-12">
              <section className={styles.formSection}>
                <h5>Business Details</h5>
                <div className={styles.formGrid}>
                  {businessFields.map(([name, label, type]) => (
                    <div key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        className={styles.formInput}
                      />
                    </div>
                  ))}
                  <div className={styles.fullWidth}>
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      rows={4}
                      value={formData.address}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="col-12">
              <section className={styles.formSection}>
                <h5>Bank Account</h5>
                <div className={styles.formGrid}>
                  {bankFields.map(([name, label]) => (
                    <div key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        name={name}
                        type="text"
                        value={formData[name]}
                        onChange={handleChange}
                        className={styles.formInput}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="col-12">
              <section className={styles.formSection}>
                <h5>UPI Details</h5>
                <div className={styles.formGrid}>
                  {upiFields.map(([name, label]) => (
                    <div key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input
                        id={name}
                        name={name}
                        type="text"
                        value={formData[name]}
                        onChange={handleChange}
                        className={styles.formInput}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {message ? (
            <div className={styles.message} role="status">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
