// pages/500.tsx or components/pages/ErrorPage.tsx

import { MainLayout } from "@/components/layout/MainLayout"

export default function ErrorPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        {/* <img
          src="/error-illustration.png" // 📌 Place this image in /public
          alt="Error"
          className="w-full max-w-md mb-6"
        /> */}
        <h1 className="text-3xl font-bold text-[#1F2A44] mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 text-sm max-w-md mb-4">
          We’re sorry, but something went wrong on our end. Please try again later or contact support.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-4 py-2 bg-[#0E4E96] text-white text-sm rounded hover:bg-[#0c3d75]"
        >
          Go Back Home
        </a>
      </div>
    </MainLayout>
  )
}
