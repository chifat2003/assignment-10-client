"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
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
      const payload = {
        email,
        password,
        name: name || email.split("@")[0],
        role,
      };
      console.log("Signing up with payload:", payload);

      // better-auth uses signUp.email() for email+password registration
      const { data, error: signUpError } = await signUp.email(payload);
      console.log("signUp response:", { data, signUpError });

      if (signUpError) {
        setError(signUpError.message || "Signup failed. Try again.");
      } else {
        router.push("/signin");
      }
    } catch (err) {
      console.error("signUp error:", err);
      setError(err?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
            >
              <option value="user">User</option>
              <option value="lawyer">Lawyer</option>
            </select>
          </div>

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
              placeholder="Choose a password"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:opacity-95"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? {" "}
          <Link href="/signin" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}


