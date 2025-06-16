import Head from "next/head"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/services/api"

export default function LoginPage() {
  const { login } = useAuth()
  const [formError, setFormError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)
  try {
    const response = await api.post("/auth/login", { email, password })
    const { success, message, data } = response.data

    if (!success || !data?.accessToken) {
      setErrors({
        email: message || "Login failed",
        password: " ",
      })
      return
    }

    // ✅ Fill in fallback name if not returned from backend
    const fullName = data.fullName || "User"

    // ✅ Call login from AuthContext (persist it)
    login({
      accessToken: data.accessToken,
      fullName,
      email,
    })

    // ✅ Wait 1 tick before redirecting to ensure context is updated
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 0)
  } catch (err: any) {
    const message = err?.response?.data?.message || "Something went wrong"
    setFormError(message)
  } finally {
    setLoading(false)
  }
}
  return (
    <>
      <Head>
        <title>Tripcater Admin Login</title>
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
          <div className="w-4/5 max-w-sm">{/* Optional SVG */}</div>
          <h2 className="mt-6 text-2xl font-semibold text-center">Plan. Book. Manage.</h2>
          <p className="text-sm text-center mt-2 text-gray-300">
            Admin travel made easy with Tripcater.
          </p>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-16 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#1F2A44] mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to manage your portal</p>
            {formError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-300">
                {formError}
            </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }))
                    }
                  }}
                  placeholder="you@tripcater.com"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-[#0E4E96]"
                  }`}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: undefined }))
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#0E4E96]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#0E4E96]"
                  >
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
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-[#0E4E96] hover:bg-[#0b3c73] text-white font-semibold py-2 rounded-md transition ${
                    loading ? "opacity-80 cursor-not-allowed" : ""
                }`}
                >
                {loading && (
                    <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                    </svg>
                )}
                {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            {/* <p className="mt-4 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <a href="/register" className="text-[#0E4E96] font-medium hover:underline">
                Create one
              </a>
            </p> */}

            <p className="mt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Tripcater. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
