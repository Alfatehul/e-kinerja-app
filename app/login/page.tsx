"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError || !signInData.user) {
      setLoading(false);
      setError("Email atau password salah.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single();

    setLoading(false);

    if (profile?.role === "admin_biro") {
      router.push("/admin/dashboard");
    } else {
      router.push("/fakultas/dashboard");
    }

    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #eef7f0 0%, #f8fafc 50%, #e8f1ea 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
        }}
      >
        {/* Logo / Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo uin.svg"
              alt="Logo UIN Ar-Raniry"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              margin: 0,
              color: "#14532D",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            E-Kinerja
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Sistem Rekapitulasi Capaian Kinerja
          </p>

          <p
            style={{
              margin: "2px 0 0",
              color: "#64748b",
              fontSize: 13,
            }}
          >
            UIN Ar-Raniry Banda Aceh
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          style={{
            background: "white",
            padding: 32,
            borderRadius: 18,
            boxShadow: "0 12px 35px rgba(15, 23, 42, 0.10)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 21,
                color: "#1e293b",
              }}
            >
              Selamat Datang
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              Silakan masuk ke akun Anda
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 7,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email Anda"
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 9,
                outline: "none",
                fontSize: 14,
                color: "#1e293b",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 7,
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password Anda"
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 9,
                outline: "none",
                fontSize: 14,
                color: "#1e293b",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px 16px",
              background: loading ? "#64748b" : "#14532D",
              color: "white",
              border: "none",
              borderRadius: 9,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              transition: "0.2s",
              boxShadow: "0 4px 10px rgba(20, 83, 45, 0.18)",
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid #eef0f3",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              E-Kinerja UIN Ar-Raniry Banda Aceh
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
