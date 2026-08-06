import { v4 as uuid } from "uuid";

const DEVICE_KEY = "device_id";

export function getDeviceId() {
  if (typeof window === "undefined") return null;

  let deviceId = localStorage.getItem(DEVICE_KEY);

  if (!deviceId) {
    deviceId = uuid();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }

  return deviceId;
}