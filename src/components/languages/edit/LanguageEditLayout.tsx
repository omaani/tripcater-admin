"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageInfoForm } from "./tabs/LanguageInfoForm"
import { LocaleResourcesTab } from "./tabs/LocaleResourcesTab"
import api from "@/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe, FileText } from "lucide-react"

interface Props {
  languageId: string
}

export function LanguageEditLayout({ languageId }: Props) {
  const [language, setLanguage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await api.get(`/language/${languageId}`)
        if (response?.data?.success) {
          setLanguage(response.data.data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLanguage()
  }, [languageId])

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="w-48 h-8 mb-4" />
        <Skeleton className="h-64 rounded-md" />
      </div>
    )
  }

  if (!language) {
    return <div className="p-6 text-red-500">Language not found.</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Edit Language: {language.name}</h2>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Language Info
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Locale Resources
          </TabsTrigger>
        </TabsList>

          <TabsContent value="info">
            <LanguageInfoForm language={language} />
          </TabsContent>

          <TabsContent value="resources">
            <LocaleResourcesTab languageId={language.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
