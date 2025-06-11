import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import SkeletonLoader from "@/components/SkeletonLoader"

export default function HomePage() {
  const { auth, authLoaded } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!authLoaded) return

    setRedirecting(true)

    if (auth?.accessToken) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [authLoaded, auth])

  return redirecting ? <SkeletonLoader /> : null
}
