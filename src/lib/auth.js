export const AUTH_STORAGE_KEY = "user";
export const AUTH_COOKIE_NAME = "auth_user";
export const AUTH_SESSION_COOKIE_NAME = "auth_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getCookieValue(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }

    const userId = getCookieValue(AUTH_COOKIE_NAME);
    return userId ? { _id: userId } : null;
  } catch {
    return null;
  }
}

export function getUserId(user = getStoredUser()) {
  if (!user || typeof user !== "object") {
    return null;
  }

  return user._id || user.id || user.userId || null;
}

export function persistUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const userId = getUserId(user);

    if (userId) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(userId)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
      document.cookie = `${AUTH_SESSION_COOKIE_NAME}=true; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
      return;
    }

    clearAuthSession();
  } catch {
    clearAuthSession();
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}

  try {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch {}

  try {
    document.cookie = `${AUTH_SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch {}
}

export function isAuthenticated() {
  return Boolean(getUserId(getStoredUser()));
}
