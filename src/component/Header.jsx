"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import { getStoredUser, getUserId } from "@/lib/auth";

export default function Header({ children }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getStoredUser();
        const userId = getUserId(user);

        if (!userId) {
          setProfile(null);
          return;
        }

        const response = await fetch(`/api/profile?userId=${encodeURIComponent(userId)}`);
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setProfile(result.data);
        }
      } catch {
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  const companyName = profile?.company_name || "MoveBook";
  const shortCompanyName =
    companyName.length > 18 ? `${companyName.slice(0, 18)}...` : companyName;
  const companyInitial = companyName.trim().charAt(0).toUpperCase() || "M";

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-2 col-md-2 col-2">
                <div>
                  <h3 className={`d-none d-lg-block mb-0 ${styles.brandName}`}>
                   MoveBook
                  </h3>
                  <span
                    className="d-block d-lg-none"
                    onClick={() => setOpenMenu(true)}
                  >
                    <i className="ri-menu-line fs-1"></i>
                  </span>
                </div>
              </div>
              <div className="col-lg-3 col-md-2 col-8">
                <div className="d-none d-lg-block">
                  <div className={styles.searchBar}>
                    <span>
                      <i className="ri-history-line fs-4"></i>
                    </span>
                    <span className={styles.searchContainer}>
                      <i className="ri-search-line"></i>
                      <input
                        type="text"
                        name=""
                        placeholder="Search In Customers ( / )"
                        id=""
                      />
                    </span>
                  </div>
                </div>
                <div className="d-block d-lg-none ">
                  <h5 className={`mb-0 ${styles.mobileCompanyName}`}>
                   MoveBook
                  </h5>
                </div>
              </div>
              <div className="col-lg-7 col-md-8 col-2">
                <div>
                  <ul className={styles.hederRightList}>
                    <li className="d-none d-md-block">
                      You Are Cur...{" "}
                      <span className="text-primary fw-normal ms-2">
                        Upgrade
                      </span>
                    </li>
                    <li className="d-none d-md-block">
                      | {shortCompanyName}{" "}
                      <span>
                        <i className="ri-arrow-down-s-line"></i>
                      </span>{" "}
                      |
                    </li>
                    <li className="d-none d-md-block">
                      <span className={styles.plusIconContainer}>
                        <i className="ri-add-box-fill fs-3"></i>
                      </span>
                    </li>
                    <li className="d-none d-md-block">
                      <span>
                        <i className="ri-notification-3-line fs-5"></i>{" "}
                      </span>
                    </li>
                    <li className="d-none d-md-block">
                      {" "}
                      <span>
                        <i className="ri-settings-3-line fs-5"></i>
                      </span>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className={styles.profileContainer}
                        aria-label="Open profile page"
                      >
                        {profile?.company_logo ? (
                          <img
                            src={profile.company_logo}
                            alt={companyName}
                            className={styles.profileLogo}
                          />
                        ) : (
                          <span>{companyInitial}</span>
                        )}
                      </Link>
                    </li>
                    <li className="d-none d-md-block">
                      <span>
                        <i className="ri-grid-fill fs-5"></i>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.mainContainer}>
          <aside
            className={`${styles.dektopMenu} ${openMenu ? styles.showMenu : ""}`}
          >
            <div className="d-block d-lg-none text-end p-2">
              <i
                className="ri-close-line fs-3"
                onClick={() => setOpenMenu(false)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div>
              <ul className={styles.menulistContainer}>
                <Link href="/dashboard" className="text-decoration-none">
                  <li className={styles.menulist}>
                    <i className="ri-home-5-line me-3"></i>
                    Home
                  </li>
                </Link>
                      <Link href="/customer" className="text-decoration-none">
                  <li className={styles.menulist}>
                    <i className="ri-user-3-line me-3"></i>
                    Customers
                  </li>
                </Link>
                <Link href="/quotation/view" className="text-decoration-none">
                  <li className={styles.menulist}>
                    <i className="ri-file-list-3-line me-3"></i>
                    Quotations
                  </li>
                </Link>
          
              </ul>
            </div>
          </aside>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </>
  );
}
