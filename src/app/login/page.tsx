"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "secret123") {
      // Set cookie (expires in 7 days)
      document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.replace("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5dc" }}>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001", minWidth: 320 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Login</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            autoComplete="username"
            required
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#D4AF37", color: "#222", fontWeight: 600, border: "none", fontSize: 16, cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
} 