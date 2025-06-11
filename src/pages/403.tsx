// pages/403.tsx or components/pages/403.tsx

import { MainLayout } from "@/components/layout/MainLayout"

export default function AccessDeniedPage() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold text-[#1F2A44] mb-4">Access Denied</h1>
        <p className="text-gray-600 text-sm max-w-md">
          You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
        </p>
      </div>
    </MainLayout>
  )
}
