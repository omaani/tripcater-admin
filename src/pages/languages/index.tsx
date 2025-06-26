"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import api from "@/services/api"

interface Language {
  id: number
  name: string
  languageCulture: string
  uniqueSeoCode: string
  rtl: boolean
  published: boolean
  displayOrder: number
}

export default function LanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await api.get("/language/list")
      if (response?.data?.success) {
        const sorted = response.data.data
          .sort((a: Language, b: Language) => a.displayOrder - b.displayOrder)
        setLanguages(sorted)
      }
    }
    fetchLanguages()
  }, [])

  const filteredLanguages = search.trim()
    ? languages.filter((lang) =>
        lang.name.toLowerCase().includes(search.toLowerCase()) ||
        lang.languageCulture.toLowerCase().includes(search.toLowerCase())
      )
    : languages

  const handleEdit = (id: number) => {
    router.push(`/languages/${id}/edit`)
  }

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Languages</h2>
            <Input
              placeholder="Search by name or culture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Culture</TableHead>
                <TableHead>RTL</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLanguages.map((lang) => (
                <TableRow key={lang.id}>
                  <TableCell>{lang.displayOrder}</TableCell>
                  <TableCell>{lang.name}</TableCell>
                  <TableCell>{lang.languageCulture}</TableCell>
                  <TableCell>
                    {lang.rtl ? <Badge variant="outline">Yes</Badge> : "No"}
                  </TableCell>
                  <TableCell>
                    {lang.published ? <Badge variant="outline">Yes</Badge> : "No"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(lang.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  )
}
