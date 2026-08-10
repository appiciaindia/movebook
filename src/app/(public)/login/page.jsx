"use client";
import styles from "./login.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getDeviceId } from "@/lib/device";
import {
  FiUserCheck,
  FiMail,
  FiSend,
  FiShield,
  FiRefreshCw,
  FiClock,
  FiLogIn,
  FiEdit3,
  FiAlertCircle,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step !== "verify") return;

    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const sendOtp = async (event) => {
    event.preventDefault();
    setMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Enter a valid email address.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        mode: "login",
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Could not send OTP.");
      return;
    }

    setStep("verify");
    setMessage("OTP sent successfully to your email.");
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setMessage("");

    if (otp.join("").length !== 4) {
      setMessage("Enter the 4-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          mode: "login",
          deviceId: getDeviceId(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "OTP verification failed.");
        return;
      }

      // HttpOnly cookie server se set ho chuki hai
      router.replace(result.redirectTo || "/dashboard");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setCanResend(false);

    await sendOtp({
      preventDefault: () => {},
    });

    setOtp(["", "", "", ""]);
  };
  return (
    <div className={`container-fluid bg-white  ${styles.pageconatiner}`}>
      <div className="row justify-content-center align-items-center">
        <div className={`col-lg-12 p-0 ${styles.loginconatiner}`}>
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
                  {/* Welcome Header */}
                  {step === "email" && (
                  <div className="text-center mb-4">
                    <div
                      className="d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        background: "#f1f5f9",
                      }}
                    >
                      <FaUser size={40} color="#0d6efd" />
                    </div>

                    <h3 className="fw-bold mb-1">Welcome Back</h3>

                    <p className="text-muted mb-0">
                      Login using Email OTP verification.
                    </p>
                  </div>
                  )}

                  {/* Email Step */}
                  {step === "email" && (
                    <form onSubmit={sendOtp}>
                      <div className="mb-3">
                        <label className="text-muted small mb-1">
                          Email Address
                        </label>

                        <div className="position-relative">
                          <FiMail
                            size={18}
                            className="position-absolute"
                            style={{
                              left: 14,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                              zIndex: 2,
                            }}
                          />

                          <input
                            type="email"
                            className={`form-control ps-5 ${styles.forminput}`}
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`btn w-100 ${styles.loginbutton}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend size={17} className="me-2" />
                            Send OTP
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* OTP Step */}
                  {step === "verify" && (
                    <form onSubmit={verifyOtp}>
                      <div className="mb-2">
                        <div className="text-center mb-3">
                          <MdOutlineSecurity size={30} color="#0d6efd" />

                          <div className="small text-muted mt-1">
                            Enter the 4-digit OTP
                          </div>
                        </div>

                        <div className="d-flex justify-content-center gap-4">
                          {[0, 1, 2, 3].map((i) => (
                            <input
                              key={i}
                              ref={(el) => (inputRefs.current[i] = el)}
                              value={otp[i]}
                              maxLength={1}
                              inputMode="numeric"
                              className={`form-control text-center ${styles.forminput}`}
                              style={{
                                width: 40,
                                height: 40,
                                fontSize: 22,
                                fontWeight: 600,
                              }}
                              onChange={(e) =>
                                handleOtpChange(e.target.value, i)
                              }
                              onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                          ))}
                        </div>

                        <div className="text-center mt-3">
                          {canResend ? (
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={resendOtp}
                            >
                              <FiRefreshCw size={15} className="me-1" />
                              Resend OTP
                            </button>
                          ) : (
                            <small className="text-muted">
                              <FiClock size={14} className="me-1" />
                              Resend OTP in {timer}s
                            </small>
                          )}
                        </div>

                        <div className="text-center mt-2">
                          <small>
                            <FiMail size={14} className="me-1 text-muted" />
                            Sent to <strong>{email}</strong>
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 ms-1"
                              onClick={() => {
                                setStep("email");
                                setOtp(["", "", "", ""]);
                              }}
                            >
                              <FiEdit3 size={13} className="me-1" />
                              Change
                            </button>
                          </small>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`btn w-100 ${styles.loginbutton}`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <FiLogIn size={17} className="me-2" />
                            Verify OTP
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Error Message */}
                  {message && (
                    <div className="alert p-1 small text-danger mt-3">
                      <FiAlertCircle size={15} className="me-1" />
                      {message}
                    </div>
                  )}

                  {/* Signup */}
                  <p className="text-center mt-3 mb-2">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-primary">
                      Create account
                    </a>
                  </p>

                  {/* Secure & Verified */}
                  <div
                    className="d-flex align-items-center justify-content-center gap-2 mt-3 py-2 px-3"
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      color: "#6c757d",
                      fontSize: "13px",
                    }}
                  >
                    <FiShield size={16} color="#198754" />

                    <span>
                      <strong style={{ color: "#198754" }}>
                        Secure & Verified
                      </strong>{" "}
                      · Your login is protected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
