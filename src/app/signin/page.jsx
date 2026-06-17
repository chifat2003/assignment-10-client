"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }
    setLoading(true);

    try {
      // Simulate auth: check localStorage for user
      await new Promise((r) => setTimeout(r, 500));
      const raw = localStorage.getItem("user");
      if (!raw) throw new Error("No account found. Please sign up.");
      const user = JSON.parse(raw);
      if (user.email !== email) throw new Error("Invalid credentials.");

      // store session marker
      localStorage.setItem("session", JSON.stringify({ email }));
      router.push("/");
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sign in to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              placeholder="Your password"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:opacity-95"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? {" "}
          <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
