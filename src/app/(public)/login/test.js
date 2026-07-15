"use client";
import styles from "./login.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, persistUser } from "@/lib/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!phone || phone.length !== 10) {
      setMessage("Enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);

const response = await fetch("/api/send-otp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    phone: `91${phone}`,
    mode: "login",
  }),
});

    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Could not send OTP. Please try again.");
      return;
    }

    setStep("verify");
    setMessage("OTP sent successfully.");
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!otp || otp.length !== 4) {
      setMessage("Enter the 4-digit OTP.");
      return;
    }

    setLoading(true);

const response = await fetch("/api/verify-otp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    phone: `91${phone}`,
    otp,
    mode: "login",
  }),
});

    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "OTP verification failed.");
      return;
    }

    try {
      if (result.user) {
        persistUser(result.user);
      } else {
        clearAuthSession();
      }
    } catch (e) {
      console.error("Failed to save user session", e);
    }

    router.push(result.redirectTo || "/dashboard");
  };

  return (
    <div className={`container-fluid bg-white p-4 ${styles.pageconatiner}`}>
      <div className="row justify-content-center align-items-center">
        <div className={`col-lg-12 p-4 ${styles.loginconatiner}`}>
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className={styles.loginimagecontainer}>
                <img
                  className={styles.loginImage}
                  src="/images/loginimage.png"
                  alt="login"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="p-2">
                <div className={styles.formContainer}>
                  <div className="text-center mb-4">
                    <h3 className="fw-bold">Welcome Back</h3>
                    <p className="text-muted">Login using OTP verification.</p>
                  </div>

                  {step === "phone" && (
                    <form onSubmit={sendOtp}>
                      <div className="mb-3">
                        <label className="text-muted small" htmlFor="phone">
                          Mobile Number
                        </label>
                        <div className="input-group">
                          <span
                            className={`input-group-text ${styles.forminput}`}
                          >
                            +91
                          </span>
                          <input
                            id="phone"
                            type="tel"
                            className={`form-control ${styles.forminput}`}
                            placeholder="Enter mobile number"
                            maxLength={10}
                            value={phone}
                            onChange={(e) =>
                              setPhone(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className={`btn w-100 ${styles.loginbutton}`}
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                    </form>
                  )}

                  {step === "verify" && (
                    <form onSubmit={verifyOtp}>
                      <div className="mb-3">
                        <label className="text-muted small" htmlFor="otp">
                          Enter 4-digit OTP
                        </label>
                        <input
                          id="otp"
                          type="text"
                          className={`form-control ${styles.forminput}`}
                          placeholder="Enter OTP"
                          maxLength={4}
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                      <button
                        type="submit"
                        className={`btn w-100 ${styles.loginbutton}`}
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </form>
                  )}

                  {step === "done" && (
                    <div className="alert alert-success" role="alert">
                      {message}
                    </div>
                  )}

                  {message && step !== "done" && (
                    <div className="alert alert-info mt-3" role="alert">
                      {message}
                    </div>
                  )}

                  <p className="mt-4 text-center">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-primary">
                      Create account
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
