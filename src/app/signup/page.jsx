"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  // Lawyer-specific fields
  const [caseWon, setCaseWon] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState("");
  const [location, setLocation] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate required fields
    if (!email || !password || !name) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate lawyer-specific required fields
    if (role === "lawyer") {
      if (!caseWon || !bio || !experience || !languages || !location) {
        setError("Please fill in all required lawyer fields.");
        return;
      }
    }

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload profile picture to imgbb if provided
      if (profilePicture) {
        const formData = new FormData();
        formData.append("image", profilePicture);
        formData.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY);

        const uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.url;
      }

      const payload = {
        email,
        password,
        name,
        role,
        ...(imageUrl && { image: imageUrl }),
      };

      // Add lawyer-specific data if role is lawyer
      if (role === "lawyer") {
        payload.caseWon = parseInt(caseWon);
        payload.bio = bio;
        payload.experience = parseInt(experience);
        payload.languages = languages.split(",").map(lang => lang.trim());
        payload.location = location;
      }

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setProfilePicture(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePicturePreview(ev.target.result);
    reader.readAsDataURL(file);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-2xl w-full bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-white">Create an Account</h2>
        <p className="text-gray-400 mb-8">Join our legal network and get started</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture (Optional)</label>
            <div className="flex items-center gap-4">
              {profilePicturePreview && (
                <img
                  src={profilePicturePreview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition"
              >
                {profilePicturePreview ? "Change" : "Choose"} Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {profilePicture && (
              <p className="text-xs text-gray-400 mt-1">{profilePicture.name}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="lawyer">Lawyer</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              placeholder="Choose a password"
            />
          </div>

          {/* Lawyer-specific fields */}
          {role === "lawyer" && (
            <div className="pt-4 border-t border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cases Won *</label>
                  <input
                    type="number"
                    value={caseWon}
                    onChange={(e) => setCaseWon(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 45"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience (Years) *</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Languages (Comma-separated) *</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., English, Spanish, French"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Bio *</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Tell us about your legal expertise and experience..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-900 border border-red-700 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


