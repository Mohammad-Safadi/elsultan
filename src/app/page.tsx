'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  // Check auth cookie on mount (client-side only)
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (document.cookie.split(';').some(c => c.trim().startsWith('auth=1'))) {
        setIsAuth(true);
        router.replace("/home");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      // On success, redirect (cookies are set by the API route)
      router.replace("/home");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5dc" }}>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #0001", minWidth: 320, maxWidth: 360 }} autoComplete="off" noValidate>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>Login</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 16, textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", fontSize: 16 }}
            autoComplete="username"
            disabled={loading}
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
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", fontSize: 16 }}
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>
        <button
          type="submit"
          style={{ width: "100%", padding: 10, borderRadius: 4, background: loading ? '#e5e5e5' : '#D4AF37', color: loading ? '#888' : '#222', fontWeight: 600, border: "none", fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
