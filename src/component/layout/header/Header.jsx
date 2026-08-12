"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";


export default function Header({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [customerData, setCustomerData] = useState([]);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customer", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCustomerData(data.data || []);
      }
    } catch (error) {
      console.error("Customer fetch error:", error);
    }
  };

  fetchCustomers();
}, []);

  const filteredCustomers = customerData.filter((customer) =>
    [customer.party_name, customer.mobile, customer.email]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase())),
  );

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        cache: "no-store",
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setProfile(result.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error(error);
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
                    <Link href="/dashboard">     <img
                  
                  src="/images/logo1.png"
                  width={170}
                  alt="login"
                /></Link>
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
                      <i className="ri-history-line fs-4 d-none"></i>
                    </span>
                    <span className={styles.searchContainer}>
                      <i className="ri-search-line"></i>
                      <div className={styles.searchWrapper}>
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search Customers..."
                        />

                        {search.trim() !== "" && (
                          <div className={styles.searchList}>
                            {filteredCustomers.length > 0 ? (
                              filteredCustomers.map((customer) => (
                                <div
                                  key={customer._id}
                                  className={styles.searchItem}
                                  onClick={() => {
                                    setSearch("");
                                    router.push(
                                      `/customer/view/${customer._id}`,
                                    );
                                  }}
                                >
                                  <div className="fw-semibold">
                                    {customer.party_name}
                                  </div>
                                  <small className="text-muted">
                                    <i className="ri-phone-line me-1"></i>
                                    {customer.mobile}
                                  </small>
                                </div>
                              ))
                            ) : (
                              <div className={styles.searchItem}>
                                No customer found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </span>
                  </div>
                </div>
                <div className="d-block d-lg-none ">
                  <h5 className={`mb-0 text-center ${styles.mobileCompanyName}`}>
                    <Link href="/dashboard">
                         <img
                  
                  src="/images/logo1.png"
                  width={170}
                  alt="login"
                />
                    </Link>
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
           <div className="d-flex justify-content-between align-items-center">
               <h4>Menu</h4>
              <i
                className="ri-close-line fs-3"
                onClick={() => setOpenMenu(false)}
                style={{ cursor: "pointer" }}
              ></i>
           </div>
            </div>
            <div>
              <ul className={styles.menulistContainer}>
                <Link href="/dashboard"  onClick={() => setOpenMenu(false)} className="text-decoration-none">
                  <li
                    className={`${styles.menulist} ${
                      pathname === "/dashboard" ? styles.active : ""
                    }`}
                  >
                    <i className="ri-home-5-line me-3"></i>
                    Home
                  </li>
                </Link>

                <Link href="/customer"  onClick={() => setOpenMenu(false)} className="text-decoration-none">
                  <li
                    className={`${styles.menulist} ${
                      pathname.startsWith("/customer") ? styles.active : ""
                    }`}
                  >
                    <i className="ri-user-3-line me-3"></i>
                    Customers
                  </li>
                </Link>

                <Link href="/quotation/view"  onClick={() => setOpenMenu(false)} className="text-decoration-none">
                  <li
                    className={`${styles.menulist} ${
                      pathname.startsWith("/quotation") ? styles.active : ""
                    }`}
                  >
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
