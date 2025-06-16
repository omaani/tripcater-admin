import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { ScrollText } from "lucide-react"
import api from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link";
import { Eye } from "lucide-react"
import { toast } from "react-toastify"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

const Calendar = dynamic(() => import("@/components/ui/calendar").then(mod => mod.Calendar), { ssr: false })
const Popover = dynamic(() => import("@/components/ui/popover").then(mod => mod.Popover), { ssr: false })
const PopoverTrigger = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverTrigger), { ssr: false })
const PopoverContent = dynamic(() => import("@/components/ui/popover").then(mod => mod.PopoverContent), { ssr: false })

function LogsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [logLevel, setLogLevel] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await api.get("/logs/list", { params: { pageIndex, pageSize: 10 } })
      if (res.data.success) {
        setLogs(res.data.data.logs || [])
        setTotalPages(res.data.data.totalPages || 1)
        setTotalRecords(res.data.data.totalItems || 0)
      }
    } catch (err) {
      console.error("Failed to load logs", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await api.get("/logs/search", {
        params: {
          pageIndex,
          pageSize: 10,
          fromDate: dateFrom ? format(dateFrom, "MM/dd/yyyy") : undefined,
          toDate: dateTo ? format(dateTo, "MM/dd/yyyy") : undefined,
          logLevelId: logLevel,
          message
        }
      })

      if (res.data.success) {
        setLogs(res.data.data.logs || [])
        setTotalPages(res.data.data.totalPages || 1)
        setTotalRecords(res.data.data.totalItems || 0)
      }
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearLogs = async () => {
    try {
      const res = await api.post("/logs/clear")
      if (res.data.success) {
        toast.success("Logs cleared successfully")
        fetchLogs()
      } else {
        toast.error(res.data.message || "Failed to clear logs")
      }
    } catch (err) {
      toast.error("An error occurred while clearing logs")
    } finally {
      setShowConfirmDialog(true)
    }
  }

  const getLogBadge = (level: number) => {
    const levels: { [key: number]: string } = {
      10: "bg-blue-100 text-blue-700",
      20: "bg-green-100 text-green-700",
      30: "bg-yellow-100 text-yellow-800",
      40: "bg-red-100 text-red-700",
      50: "bg-purple-100 text-purple-700"
    }
    return levels[level] || "bg-gray-100 text-gray-700"
  }

  const getPageNumbers = () => {
    const pages = []
    const maxDisplayed = 5
    let start = Math.max(0, pageIndex - Math.floor(maxDisplayed / 2))
    let end = Math.min(totalPages, start + maxDisplayed)

    if (end - start < maxDisplayed) {
      start = Math.max(0, end - maxDisplayed)
    }

    if (start > 0) pages.push("first")
    for (let i = start; i < end; i++) {
      pages.push(i)
    }
    if (end < totalPages) pages.push("last")

    return pages
  }

  useEffect(() => {
    fetchLogs()
    setTimeout(() => {
      const y = containerRef.current?.getBoundingClientRect().top || 0
      window.scrollTo({ top: window.scrollY + y - 80, behavior: "smooth" })
    }, 0)
  }, [pageIndex])

  return (
    <MainLayout>
      <div className="p-6 space-y-6" ref={containerRef}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1F2A44] flex items-center gap-2">
            <ScrollText className="w-6 h-6" /> Logs
          </h1>
          <Button variant="destructive" onClick={handleClearLogs} className="flex gap-1 items-center">
            <Trash2 className="w-4 h-4" /> Clear Logs
          </Button>
        </div>
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-[#1F2A44]">Confirm Log Clear</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-gray-700">
              Are you sure you want to clear all logs? This action cannot be undone.
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearLogs}>
                Clear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="bg-white p-4 rounded-md border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-sm">Date From</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dateFrom ? format(dateFrom, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block mb-1 text-sm">Date To</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dateTo ? format(dateTo, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block mb-1 text-sm">Log Level</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
              >
                <option value="0">Select</option>
                <option value="20">Information</option>
                <option value="10">Debug</option>
                <option value="30">Warning</option>
                <option value="40">Error</option>
                <option value="50">Fatal</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Message</label>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Search message"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => { setPageIndex(0); handleSearch(); }} className="bg-[#0E4E96] text-white hover:bg-[#0c3d75]">
              Search
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border">
          <p className="text-sm text-gray-500 mb-2">Page {pageIndex + 1} of {totalPages} | Total records: {totalRecords}</p>
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-3 w-32">Log Level</th>
                <th className="py-2 px-3 w-40">User</th>
                <th className="py-2 px-3 w-[40%] truncate">Short Message</th>
                <th className="py-2 px-3 w-40">Created Date</th>
                <th className="py-2 px-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="py-3"><Skeleton className="h-4 w-full" /></td>
                  </tr>
                ))
              ) : logs.length > 0 ? logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getLogBadge(log.logLevelId)}`}>
                      {log.logLevelId === 10 ? "Debug" :
                        log.logLevelId === 20 ? "Information" :
                          log.logLevelId === 30 ? "Warning" :
                            log.logLevelId === 40 ? "Error" :
                              log.logLevelId === 50 ? "Fatal" : "Unknown"}
                    </span>
                  </td>
                  <td className="py-2 px-3 truncate max-w-[150px]">{log.userEmail}</td>
                  <td className="py-2 px-3 truncate max-w-[300px]">{log.shortMessage}</td>
                  <td className="py-2 px-3">{format(new Date(log.createdOnUtc), "PPP p")}</td>
                  <td className="py-2 px-3">
                    <Link href={`/logs/${log.id}/view`}>
                      <Button variant="secondary" size="sm" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-4 text-gray-500">No logs found.</td></tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
              <span className="text-sm text-gray-500">Page {pageIndex + 1} of {totalPages} | Total records: {totalRecords}</span>
              <div className="flex gap-1 flex-wrap">
                {getPageNumbers().map((i, idx) => (
                  <button
                    type="button" // 👈 ADD THIS LINE
                    key={idx}
                    onClick={() => {
                      if (i === "first") setPageIndex(0)
                      else if (i === "last") setPageIndex(totalPages - 1)
                      else setPageIndex(i as number)
                    }}
                    className={`px-3 py-1 rounded-md border text-sm font-medium transition-all duration-150 ${pageIndex === i ? 'bg-[#0E4E96] text-white border-[#0E4E96]' : 'bg-white text-[#0E4E96] border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {i === "first" ? "First" : i === "last" ? "Last" : (i as number) + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default withAuth(LogsPage)