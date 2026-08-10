"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";


export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  
  
useEffect(() => {
  const fetchProfile = async () => {
    try {
      // Get logged in user
      const meResponse = await fetch("/api/me", {
        cache: "no-store",
      });

      if (!meResponse.ok) {
        setError("Unauthorized");
        return;
      }

      const meResult = await meResponse.json();

      if (!meResult.success) {
        setError("Unauthorized");
        return;
      }

      setUser(meResult.user);

      // Fetch profile
      const profileResponse = await fetch("/api/profile", {
        cache: "no-store",
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok || !profileResult.success) {
        setProfile(null);
        return;
      }

      setProfile(profileResult.data);
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, []);

  const companyInitial =
    (profile?.company_name?.trim()?.charAt(0) || user?.phone?.trim()?.charAt(0))
      ?.toUpperCase() || "U";



  return (
    <div className="container-fluid p-0">
      <div className={styles.companyProfile}>
        <div className={styles.logoContainer}>
          {profile?.company_logo ? (
            <img
              src={profile.company_logo}
              alt={profile.company_name || "Company logo"}
              className={styles.companyLogo}
            />
          ) : (
            <h6 className="mb-0">{companyInitial}</h6>
          )}
        </div>
        <div className={styles.companyProfileText}>
          <h5 className="fw-semibold mb-0">
            {isLoading
              ? "Loading profile..."
              : `Hello, ${
                  profile?.full_name || profile?.company_name || user?.phone || "User"
                }`}
          </h5>
          <p className="text-muted mb-0">
            {profile?.company_name || "Company profile"}
          </p>
        </div>
      </div>

      <div className="container-fluid p-4">
        {error ? (
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        ) : null}


      </div>
    </div>
  );
}
