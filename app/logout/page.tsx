"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Removed Button import; using native <button> instead

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  // Mock logout function (replace with your real auth/session clear logic)
  const handleLogout = async () => {
    setLoading(true);

    // Example: clear localStorage/session
    localStorage.removeItem("authToken");

    // Simulate async logout delay
    setTimeout(() => {
      setLoading(false);
      setLoggedOut(true);
    }, 1000);
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
        </div>

        {!loggedOut ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Logging you out...
            </h2>
            <p className="mt-2 text-gray-500">Please wait a moment</p>
            {loading && (
              <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              You have been logged out
            </h2>
            <p className="mt-2 text-gray-500">We hope to see you again soon!</p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                onClick={() => router.push("/")}
              >
                Back to Login
              </button>
              <button
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
