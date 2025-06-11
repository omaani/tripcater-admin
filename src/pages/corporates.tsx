import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react"
import api from "@/services/api"
import { toast } from "react-toastify"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react";

interface Corporate {
  name: string;
  creditLimit: number;
  availableBalance: number;
  status: string;
  id: number;
}

function CorporatesPage() {
  const [loading, setLoading] = useState(false)
  const [corporates, setCorporates] = useState<Corporate[]>([])
  const [name, setName] = useState("")
  const [status, setStatus] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [corporateName, setCorporateName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const isInitialLoad = useRef(true);

  const fetchCorporates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/corporate/list", {
        params: { pageIndex, pageSize },
      });
      if (res.data.success) {
        const result = res.data.data;
        setCorporates(result.corporates || []);
        setTotalPages(result.totalPages || 1);
        setTotalRecords(result.totalItems || 0);
      }
    } catch (err) {
      console.error("Failed to load corporates", err);
    } finally {
      setLoading(false);
    }
  };

  const searchCorporates = async () => {
    setLoading(true);
    try {
      const res = await api.post("/corporate/search", {
        name,
        status,
        pageIndex,
        pageSize,
      });
      if (res.data.success) {
        const result = res.data.data;
        setCorporates(result.corporates || []);
        setTotalPages(result.totalPages || 1);
        setTotalRecords(result.totalItems || 0);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCorporate = async () => {
    if (!corporateName || !firstName || !lastName || !email) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      const res = await api.post("/corporate/new", {
        corporateName,
        firstName,
        lastName,
        email,
        phoneNumber
      })
      if (res.data.success) {
        toast.success("Corporate created successfully")
        setFormOpen(false)
        fetchCorporates()
      } else {
        toast.error(res.data.message || "Failed to create corporate")
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Error occurred"
      toast.error(message)
    }
  }

useEffect(() => {
    fetchCorporates();
    isInitialLoad.current = false;
  }, []);

// Effect for user interactions
  useEffect(() => {
    if (!isInitialLoad.current) {
      searchCorporates();
    }
  }, [name, status, pageIndex, pageSize]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1F2A44]">Corporates</h1>
          <button
            onClick={() => setFormOpen(true)}
            className="px-4 py-2 bg-[#0E4E96] text-white rounded-md hover:bg-[#0c3d75] text-sm"
          >
            Add Corporate
          </button>
        </div>
        {formOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-2xl relative animate-slide-down">
              <h2 className="text-lg font-bold text-[#1F2A44] mb-4">Add New Corporate</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Corporate Name *" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96] text-sm" value={corporateName} onChange={e => setCorporateName(e.target.value)} />
                <input type="text" placeholder="First Name *" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96] text-sm" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last Name *" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96] text-sm" value={lastName} onChange={e => setLastName(e.target.value)} />
                <input type="email" placeholder="Email *" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96] text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Phone Number" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96] text-sm" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button className="px-5 py-2 bg-[#0E4E96] text-white rounded-md hover:bg-[#0c3d75] text-sm" onClick={handleAddCorporate}>Save</button>
                <button className="px-5 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100" onClick={() => setFormOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Corporate Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
            >
              <option value="">All Statuses</option>
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
            <button
              onClick={() => {
                setPageIndex(0);
                searchCorporates();
              }}
              className="px-4 py-2 bg-[#0E4E96] text-white rounded-md text-sm hover:bg-[#0c3d75]"
            >
              Search
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500 mb-2">Total records: {totalRecords}</p>
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
                {loading ? (
                  [...Array(pageSize)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="p-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                      <td className="p-2"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                    </tr>
                  ))
                ) : corporates.length ? corporates.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
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
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">No results found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paging Controls */}
        <div className="text-sm text-gray-500">
          Page {pageIndex + 1} of {totalPages} | Total records: {totalRecords}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            <label className="mr-2">Page size:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPageIndex(0);
              }}
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E4E96]"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

         {totalPages > 1 && (
            <div className="flex gap-2">
             {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPageIndex(i)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  pageIndex === i
                    ? "bg-[#0E4E96] text-white border-[#0E4E96]"
                    : "bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default withAuth(CorporatesPage)
