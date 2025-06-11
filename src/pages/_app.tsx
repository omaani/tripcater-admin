import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "@/contexts/AuthContext"
import Head from "next/head"
import { ToastContainer } from "react-toastify"
import { cssTransition } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { setupInterceptors } from "@/services/api"

export const FastZoom = cssTransition({
  enter: "zoomIn",
  exit: "zoomOut"
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

    useEffect(() => {
    setupInterceptors(router)
  }, [])
  
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer
          transition={FastZoom}
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop
        />
      </AuthProvider>
    </>
  )
}
