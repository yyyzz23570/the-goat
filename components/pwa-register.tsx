"use client";

import { useEffect } from "react";

/** Registers the small offline shell; HTML and APIs stay network-first. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLocalDev) {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      );
      if ("caches" in window) {
        void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
      }
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline capability is progressive enhancement and must not block planning.
    });
  }, []);

  return null;
}
