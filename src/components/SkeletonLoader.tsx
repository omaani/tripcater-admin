import { Sidebar } from "./layout/Sidebar"
import { Header } from "./layout/Header"

export default function SkeletonLoader() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 rounded" />
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
