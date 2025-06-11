// Enhanced Corporates Page with Modal Popup Form for Add Corporate + Animation

import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import api from "@/services/api"
import { toast } from "react-toastify"

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

  const fetchCorporates = async () => {
    setLoading(true)
    try {
      const res = await api.get("/corporate/list", {
        params: { pageIndex, pageSize }
      })
      if (res.data.success) {
        setCorporates(res.data.data || [])
        setTotalPages(1)
        setTotalRecords(res.data.data.length || 0)
      }
    } catch (err) {
      console.error("Failed to load corporates", err)
    } finally {
      setLoading(false)
    }
  }

  const searchCorporates = async () => {
    setLoading(true)
    try {
      const res = await api.post("/corporate/search", {
        name,
        status,
        pageIndex,
        pageSize
      })
      if (res.data.success) {
        setCorporates(res.data.data || [])
        setTotalPages(res.data.data.totalPages || 1)
        setTotalRecords(res.data.data.length || 0)
      }
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCorporate = async () => {
    if (!corporateName || !firstName || !lastName || !email) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      const res = await api.post("/corporate/add", {
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
    if (!name && !status) {
      fetchCorporates()
    } else {
      searchCorporates()
    }
  }, [pageIndex, pageSize])

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

        {/* rest of the page content remains unchanged */}

      </div>
    </MainLayout>
  )
}

export default withAuth(CorporatesPage)
