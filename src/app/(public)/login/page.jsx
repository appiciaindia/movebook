"use client";
import styles from "./login.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, persistUser } from "@/lib/auth";

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

    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp: otp.join(""),
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

  const resendOtp = async () => {
    setCanResend(false);

    await sendOtp({
      preventDefault: () => {},
    });

    setOtp(["", "", "", ""]);
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
                    <p className="text-muted">
                      Login using Email OTP verification.
                    </p>
                  </div>

                  {step === "email" && (
                    <form onSubmit={sendOtp}>
                      <div className="mb-3">
                        <label className="text-muted small">
                          Email Address
                        </label>

                        <input
                          type="email"
                          className={`form-control ${styles.forminput}`}
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
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
                      <div className="mb-2">
                        <div className="d-flex justify-content-center gap-4">
                          {[0, 1, 2, 3].map((i) => (
                            <input
                              key={i}
                              ref={(el) => (inputRefs.current[i] = el)}
                              value={otp[i]}
                              maxLength={1}
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

                        <div className="text-center ">
                          {canResend ? (
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={resendOtp}
                            >
                              Resend OTP
                            </button>
                          ) : (
                            <small className="text-muted">
                              Resend OTP in {timer}s
                            </small>
                          )}
                        </div>

                        <div className="text-center ">
                          <small>
                            Sent to <strong>{email}</strong>{" "}
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 ms-1"
                              onClick={() => {
                                setStep("email");
                                setOtp(["", "", "", ""]);
                              }}
                            >
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
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </form>
                  )}

                  {message && (
                    <div className="alert  p-1 small text-danger">
                      {message}
                    </div>
                  )}

                  <p className="text-center">
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
