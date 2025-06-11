import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Head>
        <title>Register - Tripcater Admin</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row font-[Mulish]">
        {/* Left side */}
        <div className="hidden md:flex w-1/2 bg-[#1F2A44] text-white flex-col items-center justify-center p-10 relative">
          <img
            src="/assets/logo-white.svg"
            alt="Tripcater Logo"
            className="h-10 absolute top-10 left-10"
          />
          <div className="w-4/5 max-w-sm">
            {/* Reuse existing SVG or keep it empty if clean look is preferred */}
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-center">Create Your Admin Account</h2>
          <p className="text-sm text-center mt-2 text-gray-300">
            Start managing your business travel efficiently.
          </p>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#1F2A44] mb-2">Get Started</h2>
            <p className="text-sm text-gray-500 mb-6">Create your Tripcater admin account</p>

            <form className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@tripcater.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0E4E96]"
                  >
                    {/* Toggle icon */}
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.179-6.225M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0E4E96] hover:bg-[#0b3c73] text-white font-semibold py-2 rounded-md transition"
              >
                Create Account
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0E4E96] font-medium hover:underline">
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Tripcater. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
