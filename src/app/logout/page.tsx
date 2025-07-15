"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Remove the auth cookie by setting it to expire in the past
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/login");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5dc" }}>
      <div style={{ background: "white", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001", minWidth: 320, textAlign: "center" }}>
        Logging out...
      </div>
    </div>
  );
} 