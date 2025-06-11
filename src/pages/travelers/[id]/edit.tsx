import { MainLayout } from "@/components/layout/MainLayout"
import withAuth from "@/components/ProtectedPage"
import { useRouter } from "next/router";
import { TravelerEditLayout } from "@/components/travelers/edit/TravelerEditLayout";

function EditTravelerPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") return null;

  return (
    <MainLayout>
        <TravelerEditLayout />
    </MainLayout>
  )
}
export default withAuth(EditTravelerPage)
