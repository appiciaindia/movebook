"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "../../component/header/Header";
import { useEffect, useState } from "react";
import { getStoredUser, getUserId, isAuthenticated } from "@/lib/auth";

export default function PublicLayout({ children }) {

  const pathname = usePathname();
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  // Guest only routes
  const guestRoutes = [
    "/",
    "/login",
    "/signup",
  ];

  // Authenticated but profile incomplete route
  const onboardingRoutes = [
    "/register",
  ];

  useEffect(() => {

    const user = getStoredUser();

    const userId = getUserId(user);

    // Not logged in
    if (!userId) {

      if (
        !guestRoutes.includes(pathname)
      ) {

        router.replace("/login");

        return;
      }

    }

    // Logged in users should not visit login/signup
    else {

      if (
        guestRoutes.includes(pathname)
      ) {

        router.replace("/dashboard");

        return;
      }

    }

    setChecked(true);

  }, [pathname, router]);

  if (!checked) {
    return null;
  }

  // Guest pages without header
  if (
    guestRoutes.includes(pathname)
  ) {

    return <>{children}</>;

  }

  // Register page without header
  if (
    onboardingRoutes.includes(pathname)
  ) {

    return <>{children}</>;

  }

  // Protected pages with header
  return (
    <Header>
      {children}
    </Header>
  );

}
