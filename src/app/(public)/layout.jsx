"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "../../component/layout/header/Header";
import { useEffect, useState } from "react";

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  // Routes accessible without login
  const guestRoutes = [
    "/",
    "/login",
    "/signup",
    "/register",
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET",
          cache: "no-store",
        });

        let user = null;

        if (res.ok) {
          const result = await res.json();

          if (result.success) {
            user = result.user;
          }
        }

        // User NOT logged in
        if (!user) {
          if (!guestRoutes.includes(pathname)) {
            router.replace("/login");
            return;
          }
        }
        // User logged in
        else {
          if (
            pathname === "/" ||
            pathname === "/login" ||
            pathname === "/signup"
          ) {
            router.replace("/dashboard");
            return;
          }
        }

        setChecked(true);
      } catch (error) {
        console.error("Auth check failed:", error);

        if (!guestRoutes.includes(pathname)) {
          router.replace("/login");
          return;
        }

        setChecked(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!checked) {
    return null;
  }

  // Login / Signup / Register pages
  if (guestRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Protected pages
  return <Header>{children}</Header>;
}