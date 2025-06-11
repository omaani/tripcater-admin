import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { MainLayout } from "@/components/layout/MainLayout"
import api from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LogViewPage() {
  const router = useRouter()
  const { id } = router.query
  const [log, setLog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchLog = async () => {
      try {
        const res = await api.get(`/log/view/${id}`)
        if (res.data.success) {
          setLog(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching log", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLog()
  }, [id])

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

  const highlightStackTrace = (text: string) => {
    return text.split('\n').map((line, i) => {
      const isErrorLine = /Exception|at\s+[\w\.]+/.test(line)
      return (
        <div
          key={i}
          className={
            isErrorLine
              ? "text-red-700 font-mono bg-red-50 px-2 py-0.5 rounded"
              : "text-gray-800 font-mono"
          }
        >
          {line}
        </div>
      )
    })
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 pb-16">
       <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-[#1F2A44] flex items-center gap-2">
            <ScrollText className="w-6 h-6" /> Log Details
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/logs")}
            className="shrink-0"
          >
            Back to Logs
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : !log ? (
          <p className="text-red-600">Log not found.</p>
        ) : (
          <div className="bg-white p-6 rounded-md border space-y-4 text-sm">
            <div>
              <span className="font-semibold">Log Level:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getLogBadge(log.logLevelId)}`}>
                {log.logLevelId === 10 ? "Debug" :
                 log.logLevelId === 20 ? "Information" :
                 log.logLevelId === 30 ? "Warning" :
                 log.logLevelId === 40 ? "Error" :
                 log.logLevelId === 50 ? "Fatal" : "Unknown"}
              </span>
            </div>
            <div><span className="font-semibold">User Email:</span> {log.userEmail || "-"}</div>
            <div><span className="font-semibold">IP Address:</span> {log.ipAddress || "-"}</div>
            <div><span className="font-semibold">Api URL:</span> {log.pageUrl || "-"}</div>
            <div><span className="font-semibold">Referrer URL:</span> {log.referrerUrl || "-"}</div>
            <div><span className="font-semibold">Created Date:</span> {format(new Date(log.createdOnUtc), "PPP p")}</div>
            <div>
              <span className="font-semibold">Short Message:</span>
              <p className="mt-1 bg-gray-50 p-2 rounded border text-gray-800 whitespace-pre-wrap">{log.shortMessage}</p>
            </div>
            <div>
              <span className="font-semibold">Full Message:</span>
              <div className="mt-1 bg-gray-50 p-2 rounded border text-sm space-y-1">
                {log.fullMessage ? highlightStackTrace(log.fullMessage) : <span className="italic text-gray-400">(No full message)</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
