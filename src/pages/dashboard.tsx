// Updated Dashboard Layout Components with Enhancements for Flight Icon and View All Buttons

import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useEffect, useState } from "react"
import { CreditCard, Users, Plane, Eye, PlaneTakeoff } from "lucide-react"
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend, Bar, BarChart } from 'recharts'
import api from "@/services/api"
import Link from "next/link";

const COLORS = ['#0E4E96', '#84cc16', '#f97316']
import { TooltipProps } from 'recharts'
function CustomTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-sm shadow-md rounded-md px-3 py-2 border border-gray-200">
        <p className="font-medium text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2 text-gray-600 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span>
              {entry.name}: {" "}
              <strong className="text-[#0E4E96] font-semibold">{entry.value}</strong>
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface DashboardData {
  totalSales: number;
  totalCorporates: number;
  totalTrips: number;
  bookingsOverTimes: { date: string; trips: number }[];
  topDestinations: { name: string; value: number }[];
  flightTypeDistributions: { name: string; value: number }[];
  recentCustomers: any[];
  recentBookings: any[];
}

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard")
        if (res.data.success) setData(res.data.data)
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statusStyles: Record<string, string> = {
    Rejected: "bg-red-100 text-red-700",
    "Pending Issuance": "bg-yellow-100 text-yellow-700",
    Canceled: "bg-gray-100 text-gray-700",
    OnHold: "bg-blue-100 text-blue-700",
    Issued: "bg-green-100 text-green-700"
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#1F2A44]">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white animate-pulse rounded-lg border p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          )) : (
            [
              { title: "Total Sales", value: `JOD ${data?.totalSales.toFixed(2)}`, icon: CreditCard },
              { title: "Total Corporates", value: data?.totalCorporates, icon: Users },
              { title: "Total Trips", value: data?.totalTrips, icon: Plane }
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 border rounded-lg flex items-center gap-4">
                <item.icon className="text-[#0E4E96] w-7 h-7" />
                <div>
                  <h4 className="text-sm text-gray-500">{item.title}</h4>
                  <p className="text-lg font-bold text-[#1F2A44]">{item.value}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border rounded-lg p-4 animate-pulse h-[220px]">
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-[#1F2A44] mb-2">Bookings Over Time</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data?.bookingsOverTimes?.map((d) => ({ date: new Date(d.date).toLocaleDateString(), trips: d.trips }))}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="trips" stroke="#0E4E96" strokeWidth={2} name="Bookings" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-[#1F2A44] mb-2">Top Destinations</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={data?.topDestinations} dataKey="value" nameKey="name" outerRadius={60}>
                      {data?.topDestinations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-[#1F2A44] mb-2">Flight Type Distribution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data?.flightTypeDistributions}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#0E4E96" name="Trips" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
        {
          !loading ? (
            <>
              {/* Recent Bookings */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#1F2A44]">Recent Bookings</h3>
                  <Link href="/trips">
                    <button className="px-4 py-1 text-sm rounded bg-[#0E4E96] text-white hover:bg-[#0c3d75]">View All</button>
                  </Link>
                  
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="p-2">Trip ID</th>
                        <th className="p-2">Service Type</th>
                        <th className="p-2">Flight Type</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Order Total</th>
                        <th className="p-2">Create Date</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.recentBookings.map((b, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-2">{b.customId}</td>
                          <td className="p-2 flex items-center gap-1">
                            <PlaneTakeoff className="w-4 h-4 text-[#0E4E96]" /> {b.serviceType}
                          </td>
                          <td className="p-2">{b.flightType}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${statusStyles[b.status] || 'bg-gray-100 text-gray-500'}`}>
                              {b.status || 'N/A'}
                            </span>
                          </td>
                          <td className="p-2">{b.orderTotal}</td>
                          <td className="p-2">{b.createdDate}</td>
                          <td className="p-2">
                            <button className="text-[#0E4E96] hover:underline text-xs inline-flex items-center gap-1">
                              <Eye className="w-4 h-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Customers */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#1F2A44]">Recent Customers</h3>
                  <Link href="/corporates">
                    <button className="px-4 py-1 text-sm rounded bg-[#0E4E96] text-white hover:bg-[#0c3d75]">View All</button>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="p-2">Name</th>
                        <th className="p-2">Credit Limit</th>
                        <th className="p-2">Available Balance</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.recentCustomers.map((c, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-2">{c.name}</td>
                          <td className="p-2">JOD {c.creditLimit.toFixed(2)}</td>
                          <td className="p-2">JOD {c.availableBalance.toFixed(2)}</td>
                          <td className="p-2">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${c.status === 'A' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {c.status === 'A' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-2">
                            <Link href={`/corporates/${c.id}/edit`}>
                              <button className="text-[#0E4E96] hover:underline text-xs inline-flex items-center gap-1">
                                <Eye className="w-4 h-4" /> View
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            // 🔄 Skeleton loading while `loading` is true
            <div className="bg-white p-4 rounded-lg border animate-pulse">
              <div className="h-6 bg-gray-200 w-40 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </MainLayout>
  )
}

export default withAuth(Dashboard)
