import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useRouter } from "next/router";
import { CorporateEditLayout } from "@/components/corporate/edit/CorporateEditLayout";

function EditCorporatePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") return null;

  return (
    <MainLayout>
        <CorporateEditLayout corporateId={id} />
    </MainLayout>
  )
}
export default withAuth(EditCorporatePage)
