import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import SkeletonLoader from "@/components/SkeletonLoader"
import type { ComponentType, JSX } from "react"

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  const ProtectedComponent = (props: P) => {
    const { auth, authLoaded  } = useAuth()
    const router = useRouter()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
      // Wait until auth is defined (either real or null)
      if (!authLoaded) return

      if (!auth || !auth.accessToken) {
        router.replace("/login")
      } else {
        setChecked(true)
      }
      }, [authLoaded, auth])

    if (!checked) return <SkeletonLoader />
    return <WrappedComponent {...props} />
  }

  return ProtectedComponent
}
