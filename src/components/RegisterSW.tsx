"use client"; // Required for browser APIs

import { useEffect } from "react";

const RegisterSW = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch((err) =>
          console.error("Service Worker Registration Failed:", err)
        );
    }
  }, []);

  return null; // No UI needed
};

export default RegisterSW;
