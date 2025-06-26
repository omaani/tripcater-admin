"use client"

import { useRouter } from "next/router";
import withAuth from "@/components/ProtectedPage"
import { MainLayout } from "@/components/layout/MainLayout"
import { LanguageEditLayout } from "@/components/languages/edit/LanguageEditLayout";

function EditLanguagePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") return null;

  return (
    <MainLayout>
        <LanguageEditLayout languageId={id} />
    </MainLayout>
  )
}
export default withAuth(EditLanguagePage)
