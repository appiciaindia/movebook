"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getStoredUser, getUserId } from "@/lib/auth";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const parsedUser = getStoredUser();
    setUser(parsedUser);

    const fetchProfile = async () => {
      try {
        let url = "/api/profile";
        const userId = getUserId(parsedUser);

        if (userId) {
          url += `?userId=${encodeURIComponent(userId)}`;
        } else if (parsedUser?.email) {
          url += `?email=${encodeURIComponent(parsedUser.email)}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || !result.success) {
          // if no profile found for this user, that's ok — we'll still show user info
          setProfile(null);
          return;
        }

        setProfile(result.data);
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
