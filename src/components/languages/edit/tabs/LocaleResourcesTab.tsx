"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Save, Trash2, Plus, Pencil } from "lucide-react"
import api from "@/services/api"
import { toast } from "react-toastify"
import {
  Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter
} from "@/components/ui/dialog"

interface Props {
  languageId: number
}

export function LocaleResourcesTab({ languageId }: Props) {
  const [filters, setFilters] = useState({ name: "", value: "" })
  const [resources, setResources] = useState<any[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, totalPages: 1, totalItems: 0 })
  const [isAdding, setIsAdding] = useState(false)
  const [newRow, setNewRow] = useState({ resourceName: "", resourceValue: "" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState({ resourceName: "", resourceValue: "" })

  const fetchResources = async (page = 0, newFilters = filters, pageSize = pagination.pageSize) => {
    const response = await api.post(`/language/resources/search/${languageId}`, {
      name: newFilters.name,
      value: newFilters.value,
      pageIndex: page,
      pageSize,
    })

    if (response?.data?.success) {
      const data = response.data.data
      setResources(data.localeResources)
      setPagination({
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
      })
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const handleAdd = async () => {
    if (!newRow.resourceName || !newRow.resourceValue) {
      toast.error("Both fields are required")
      return
    }
    try {
      const res = await api.post(`/resources/new/${languageId}`, newRow)
      if (res?.data?.success) {
        toast.success(res.data.data)
        setNewRow({ resourceName: "", resourceValue: "" })
        setIsAdding(false)
        fetchResources(pagination.pageIndex)
      } else {
        toast.error(res.data.message || "Failed to add")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Already exists or invalid")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await api.delete(`/language/resources/${id}`)
      if (res?.data?.success) {
        toast.success(res.data.data)
        fetchResources(pagination.pageIndex)
      } else {
        toast.error("Delete failed")
      }
    } catch {
      toast.error("Error deleting resource")
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const res = await api.put(`/language/resources/${id}`, editValues)
      if (res?.data?.success) {
        toast.success(res.data.data)
        setEditingId(null)
        fetchResources(pagination.pageIndex)
      } else {
        toast.error(res.data.message || "Update failed")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update error")
    }
  }

  const handleReset = () => {
    setFilters({ name: "", value: "" })
    fetchResources(0, { name: "", value: "" })
  }

  return (
      <div className="space-y-4">
      {/* Search Box */}
      <div className="bg-white shadow-sm border rounded-md p-4">
  <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
  <div className="flex justify-between flex-wrap items-end gap-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col">
              <label className="text-sm">Search by Name</label>
              <Input
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                placeholder="tripcater.label"
                className="w-[200px]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Search by Value</label>
              <Input
                value={filters.value}
                onChange={(e) => setFilters({ ...filters, value: e.target.value })}
                placeholder="Contains..."
                className="w-[200px]"
              />
            </div>
            <Button onClick={() => fetchResources(0)}>Search</Button>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-1" /> Add New
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm border rounded-md p-4">
        {/* Table Header */}
        <div className="text-sm text-muted-foreground px-1 mb-2">
         Total records: {pagination.totalItems}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="max-w-[400px]">Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              <TableCell>
                <Input
                  value={newRow.resourceName}
                  onChange={(e) => setNewRow({ ...newRow, resourceName: e.target.value })}
                  placeholder="tripcater.label.name"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={newRow.resourceValue}
                  onChange={(e) => setNewRow({ ...newRow, resourceValue: e.target.value })}
                  placeholder="Label text..."
                />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost" onClick={handleAdd}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewRow({ resourceName: "", resourceValue: "" })
                  }}
                >
                  ✕
                </Button>
              </TableCell>
            </TableRow>
          )}

          {resources.map((res) => (
            <TableRow key={res.id}>
              {editingId === res.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editValues.resourceName}
                      onChange={(e) => setEditValues({ ...editValues, resourceName: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editValues.resourceValue}
                      onChange={(e) => setEditValues({ ...editValues, resourceValue: e.target.value })}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleUpdate(res.id)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      ✕
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-x truncate">{res.resourceName}</TableCell>
                  <TableCell className="font-mono  max-w-[400px] truncate">{res.resourceValue}</TableCell>
                  <TableCell className="text-right min-w-[80px] space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(res.id)
                        setEditValues({
                          resourceName: res.resourceName,
                          resourceValue: res.resourceValue,
                        })
                      }}
                    >
                      <Pencil className="w-4 h-4 text-orange-500" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <p>This will permanently delete the resource.</p>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => handleDelete(res.id)}>
                            Confirm Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
        <div className="flex justify-between items-center pt-4 flex-wrap gap-3">
          <div className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {pagination.totalPages} | Total records: {pagination.totalItems}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Page size:</label>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                const size = parseInt(value)
                setPagination((prev) => ({ ...prev, pageSize: size }))
                fetchResources(0, filters, size)
              }}
            >
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant={i === pagination.pageIndex ? "default" : "outline"}
                onClick={() => fetchResources(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
