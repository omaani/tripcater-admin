"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash, Plus, CheckCircle, XCircle } from "lucide-react"
import api from "@/services/api"
import { useParams } from "next/navigation"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { Skeleton } from "@/components/ui/skeleton"

export interface PriceSettingTableProps {
  id: number;
  airline: string;
  cabinClass: string;
  priceFrom: number;
  priceTo: number;
  commissionAmount: number;
}

interface CorporatePriceSettingsTableProps {
  priceSettings: PriceSettingTableProps[];
}

export const CorporatePriceSettingsTable = ({ priceSettings }: CorporatePriceSettingsTableProps) => {
  // Local state initialized from prop
  const [settings, setSettings] = useState<PriceSettingTableProps[]>(priceSettings)
  const [airlines, setAirlines] = useState<{ label: string; value: string }[]>([])
  const [addingRow, setAddingRow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newRow, setNewRow] = useState({ airline: "", cabinClass: "", priceFrom: "", priceTo: "", commissionAmount: "" })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const params = useParams()
  const corporateId = params?.id as string

  // Sync incoming prop if it ever changes
  useEffect(() => {
    setSettings(priceSettings)
  }, [priceSettings])

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      const res = await api.get(`/corporate/price-settings/${corporateId}`)
      const data = res.data?.data?.priceMarkupSettings
      if (Array.isArray(data)) {
        setSettings(data)
      } else {
        console.error("priceMarkupSettings not found or not an array", res.data)
        setSettings([])
      }
    } catch (error) {
      console.error("Failed to fetch price settings", error)
      setSettings([])
    }
  }

  // Fetch list of airlines for dropdown
  const fetchAirlines = async () => {
    try {
      const res = await api.get("/directory/airlines")
      const options = res.data?.data?.map((a: any) => ({ label: a.name, value: a.code })) || []
      setAirlines(options)
    } catch (error) {
      console.error("Failed to fetch airlines", error)
      setAirlines([])
    }
  }

  // Initial load
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([fetchSettings(), fetchAirlines()])
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Handle input changes for new row
  const handleInputChange = (field: string, value: string) => {
    setNewRow(prev => ({ ...prev, [field]: value }))
  }

  // Save new price setting
  const handleSave = async () => {
    if (!newRow.priceFrom || !newRow.priceTo || !newRow.commissionAmount) {
      toast.error("Price From, Price To, and Commission Amount are required.")
      return
    }
    if (!newRow.airline && !newRow.cabinClass) {
      toast.error("Please select either Airline or Cabin Class.")
      return
    }
    if (Number(newRow.priceFrom) > Number(newRow.priceTo)) {
      toast.error("Price From cannot be greater than Price To.")
      return
    }
    try {
      await api.post(`/corporate/price-settings/new/${corporateId}`, {
        priceFrom: Number(newRow.priceFrom),
        priceTo: Number(newRow.priceTo),
        commissionAmount: Number(newRow.commissionAmount),
        ...(newRow.airline && { airline: newRow.airline }),
        ...(newRow.cabinClass && { cabinClass: newRow.cabinClass }),
      })
      toast.success("Price setting added")
      setAddingRow(false)
      setNewRow({ airline: "", cabinClass: "", priceFrom: "", priceTo: "", commissionAmount: "" })
      fetchSettings()
    } catch (error) {
      toast.error("Failed to save price setting")
    }
  }

  // Confirm deletion
  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete(`/corporate/price-settings/delete/${deleteId}`)
      toast.success("Price setting deleted")
      setDeleteId(null)
      setOpenDialog(false)
      fetchSettings()
    } catch (error) {
      toast.error("Failed to delete price setting")
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1F2A44]">Price markup settings</h2>
        {!addingRow && (
          <Button size="sm" className="bg-[#1F2A44] text-white hover:bg-[#162033]" onClick={() => setAddingRow(true)}>
            <Plus className="w-4 h-4 mr-1 text-white" /> Add
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Airline</th>
                <th className="p-2">Cabin Class</th>
                <th className="p-2">Price From</th>
                <th className="p-2">Price To</th>
                <th className="p-2">Commission Amount</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addingRow && (
                <tr className="border-b bg-gray-50">
                  <td className="p-2">
                    <select
                      value={newRow.airline}
                      onChange={(e) => handleInputChange("airline", e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select</option>
                      {airlines.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={newRow.cabinClass}
                      onChange={(e) => handleInputChange("cabinClass", e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Y">Economy</option>
                      <option value="C">Business</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={newRow.priceFrom}
                      onChange={(e) => handleInputChange("priceFrom", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={newRow.priceTo}
                      onChange={(e) => handleInputChange("priceTo", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={newRow.commissionAmount}
                      onChange={(e) => handleInputChange("commissionAmount", e.target.value)}
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" className="bg-[#1F2A44] text-white hover:bg-[#162033]" onClick={handleSave}>
                      <CheckCircle className="w-4 h-4 mr-1 text-white" /> Save
                    </Button>
                    <Button size="sm" className="bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddingRow(false)}>
                      <XCircle className="w-4 h-4 mr-1 text-gray-700" /> Cancel
                    </Button>
                  </td>
                </tr>
              )}

              {priceSettings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No price settings found.
                  </td>
                </tr>
              ) : (
                priceSettings.map((ap) => (
                  <tr key={ap.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{airlines.find(a => a.value === ap.airline)?.label || ap.airline}</td>
                    <td className="p-2">{ap.cabinClass === "Y" ? "Economy" : "Business"}</td>
                    <td className="p-2">{ap.priceFrom}</td>
                    <td className="p-2">{ap.priceTo}</td>
                    <td className="p-2">{ap.commissionAmount}</td>
                    <td className="p-2">
                      <Dialog open={openDialog && deleteId === ap.id} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setDeleteId(ap.id); setOpenDialog(true) }}>
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this setting?</DialogTitle>
                          </DialogHeader>
                          <DialogFooter className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
